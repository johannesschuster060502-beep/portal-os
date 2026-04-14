import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Portal OS — New Tab 3D Scene
 *
 * Spec:
 *   Primary icosahedron:   IcosahedronGeometry(22, 2), pos (20,-8,-20), Y+=0.0012 X+=0.0006, wireframe #0d0d0d
 *   Secondary icosahedron: IcosahedronGeometry(10, 1), pos (-18,12,-25), Y-=0.0018 Z+=0.0009, wireframe #111111
 *   Particles:             5000 BufferGeometry, 200³ cube, #181818, size 0.12, sizeAttenuation: true
 *                          Group Y rotation += 0.0003
 *   Camera:                Perspective(55, aspect, 0.1, 300), pos (0,0,45)
 *                          Parallax: (mouseX*4, -mouseY*4, 45), lerp 0.025
 *   Renderer:              setClearColor(0x050505, 1), pixelRatio cap 2x, antialias true
 *   Performance:           Pause on document.hidden, full disposal on unmount
 *   Fade-in:               Canvas opacity 0 → 1 over 600ms after mount
 */

export default function ThreeScene(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x050505, 1)

    // Canvas fade-in
    const canvasEl = renderer.domElement
    canvasEl.style.opacity = '0'
    canvasEl.style.transition = 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)'
    container.appendChild(canvasEl)
    requestAnimationFrame(() => {
      canvasEl.style.opacity = '1'
    })

    // ── Scene + Camera ──
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      300
    )
    camera.position.set(0, 0, 45)

    // ── Particles — 5000 points, 200³ cube ──
    const particleCount = 5000
    const pGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 200
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0x181818,
      size: 0.12,
      sizeAttenuation: true
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ── Primary icosahedron — Icosahedron(22, 2), pos (20,-8,-20) ──
    const icoGeo = new THREE.IcosahedronGeometry(22, 2)
    const icoMat = new THREE.MeshBasicMaterial({ color: 0x0d0d0d, wireframe: true })
    const ico = new THREE.Mesh(icoGeo, icoMat)
    ico.position.set(20, -8, -20)
    scene.add(ico)

    // ── Secondary icosahedron — Icosahedron(10, 1), pos (-18,12,-25) ──
    const ico2Geo = new THREE.IcosahedronGeometry(10, 1)
    const ico2Mat = new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: true })
    const ico2 = new THREE.Mesh(ico2Geo, ico2Mat)
    ico2.position.set(-18, 12, -25)
    scene.add(ico2)

    // ── Mouse parallax ──
    let mX = 0
    let mY = 0

    const onMove = (e: MouseEvent): void => {
      mX = e.clientX / window.innerWidth - 0.5
      mY = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMove)

    // ── Visibility pause ──
    const onVisibility = (): void => {
      pausedRef.current = document.hidden
      if (!document.hidden) animate()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // ── Animation loop — spec rotation speeds ──
    const animate = (): void => {
      if (pausedRef.current) return
      frameRef.current = requestAnimationFrame(animate)

      // Particle group rotation — slow drift
      particles.rotation.y += 0.0003

      // Primary icosahedron
      ico.rotation.y += 0.0012
      ico.rotation.x += 0.0006

      // Secondary icosahedron
      ico2.rotation.y -= 0.0018
      ico2.rotation.z += 0.0009

      // Camera parallax — target (mouseX*4, -mouseY*4, 45), lerp 0.025
      camera.position.x += (mX * 4 - camera.position.x) * 0.025
      camera.position.y += (-mY * 4 - camera.position.y) * 0.025

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize ──
    const onResize = (): void => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── Cleanup ──
    return () => {
      pausedRef.current = true
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)

      pGeo.dispose()
      pMat.dispose()
      icoGeo.dispose()
      icoMat.dispose()
      ico2Geo.dispose()
      ico2Mat.dispose()
      renderer.dispose()

      if (container.contains(canvasEl)) {
        container.removeChild(canvasEl)
      }
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }} />
}

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Portal OS — Cinematic 3D New Tab Scene
 *
 * Elements:
 *   - Primary wireframe icosahedron (large, drifts)
 *   - Secondary wireframe icosahedron (medium)
 *   - Tertiary wireframe torus knot (small, counter-rotates)
 *   - 8000 particles in 240³ cube for depth
 *   - Distant point cloud (2000 particles, slow drift)
 *   - Slow camera auto-drift + mouse parallax
 *   - Ambient violet point light for subtle color
 *   - 600ms canvas fade-in
 *   - Auto-pause on document.hidden
 */

export default function ThreeScene(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x050505, 1)

    const canvasEl = renderer.domElement
    canvasEl.style.opacity = '0'
    canvasEl.style.transition = 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1)'
    container.appendChild(canvasEl)
    requestAnimationFrame(() => {
      canvasEl.style.opacity = '1'
    })

    // ── Scene + Camera ──
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x050505, 60, 180)

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      400
    )
    camera.position.set(0, 0, 48)

    // ── Ambient violet light — adds very subtle color ──
    const accentLight = new THREE.PointLight(0x7c6af7, 0.3, 100)
    accentLight.position.set(15, -5, -10)
    scene.add(accentLight)

    // ── Near particle field — 8000 points, 240³ cube ──
    const nearCount = 8000
    const nearGeo = new THREE.BufferGeometry()
    const nearPos = new Float32Array(nearCount * 3)
    for (let i = 0; i < nearCount * 3; i++) {
      nearPos[i] = (Math.random() - 0.5) * 240
    }
    nearGeo.setAttribute('position', new THREE.BufferAttribute(nearPos, 3))
    const nearMat = new THREE.PointsMaterial({
      color: 0x1a1a1a,
      size: 0.11,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9
    })
    const nearParticles = new THREE.Points(nearGeo, nearMat)
    scene.add(nearParticles)

    // ── Far particle field — 2000 points, larger distribution ──
    const farCount = 2000
    const farGeo = new THREE.BufferGeometry()
    const farPos = new Float32Array(farCount * 3)
    for (let i = 0; i < farCount * 3; i++) {
      farPos[i] = (Math.random() - 0.5) * 360
    }
    farGeo.setAttribute('position', new THREE.BufferAttribute(farPos, 3))
    const farMat = new THREE.PointsMaterial({
      color: 0x0f0f0f,
      size: 0.3,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6
    })
    const farParticles = new THREE.Points(farGeo, farMat)
    scene.add(farParticles)

    // ── Primary icosahedron — large, subtle drift ──
    const icoGeo = new THREE.IcosahedronGeometry(24, 2)
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x0f0f0f,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    })
    const ico = new THREE.Mesh(icoGeo, icoMat)
    ico.position.set(22, -9, -22)
    scene.add(ico)

    // ── Secondary icosahedron — medium, counter-rotate ──
    const ico2Geo = new THREE.IcosahedronGeometry(11, 1)
    const ico2Mat = new THREE.MeshBasicMaterial({
      color: 0x121212,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    })
    const ico2 = new THREE.Mesh(ico2Geo, ico2Mat)
    ico2.position.set(-20, 13, -26)
    scene.add(ico2)

    // ── Tertiary torus knot — elegant detail ──
    const knotGeo = new THREE.TorusKnotGeometry(5, 1.4, 80, 10)
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0x15131f,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    })
    const knot = new THREE.Mesh(knotGeo, knotMat)
    knot.position.set(-8, -14, -14)
    scene.add(knot)

    // ── Mouse parallax + slow auto-drift ──
    let mX = 0
    let mY = 0
    let targetX = 0
    let targetY = 0

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

    // ── Animation loop ──
    const clock = new THREE.Clock()

    const animate = (): void => {
      if (pausedRef.current) return
      frameRef.current = requestAnimationFrame(animate)

      const t = clock.getElapsedTime()

      // Particle fields — slow drift
      nearParticles.rotation.y += 0.00025
      farParticles.rotation.y += 0.00012
      farParticles.rotation.x = Math.sin(t * 0.05) * 0.03

      // Primary icosahedron
      ico.rotation.y += 0.0014
      ico.rotation.x += 0.0007

      // Secondary icosahedron — counter rotation
      ico2.rotation.y -= 0.0018
      ico2.rotation.z += 0.001

      // Torus knot — complex rotation, slow breath
      knot.rotation.y += 0.0012
      knot.rotation.x += 0.0008
      const breath = 1 + Math.sin(t * 0.4) * 0.04
      knot.scale.set(breath, breath, breath)

      // Camera — mouse parallax + slow auto-drift (cinematic breath)
      targetX = mX * 5 + Math.sin(t * 0.08) * 0.8
      targetY = -mY * 5 + Math.cos(t * 0.06) * 0.6
      camera.position.x += (targetX - camera.position.x) * 0.02
      camera.position.y += (targetY - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)

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

      nearGeo.dispose()
      nearMat.dispose()
      farGeo.dispose()
      farMat.dispose()
      icoGeo.dispose()
      icoMat.dispose()
      ico2Geo.dispose()
      ico2Mat.dispose()
      knotGeo.dispose()
      knotMat.dispose()
      renderer.dispose()

      if (container.contains(canvasEl)) {
        container.removeChild(canvasEl)
      }
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }} />
}

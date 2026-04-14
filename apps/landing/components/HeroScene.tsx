'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Portal OS — Landing Page Hero 3D Scene
 *
 * Cinematic wireframe field with:
 *   - 3 wireframe meshes (icosahedron + icosahedron + torus knot)
 *   - Dual particle fields (near + far for depth)
 *   - Slow auto-drift camera
 *   - Mouse parallax
 *   - Ambient violet point light
 *   - Fog for depth falloff
 *   - 800ms canvas fade-in
 */

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

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
    canvasEl.style.transition = 'opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1)'
    container.appendChild(canvasEl)
    requestAnimationFrame(() => {
      canvasEl.style.opacity = '1'
    })

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x050505, 55, 200)

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      400
    )
    camera.position.set(0, 0, 52)

    // Violet accent light
    const accentLight = new THREE.PointLight(0x7c6af7, 0.4, 120)
    accentLight.position.set(18, -6, -14)
    scene.add(accentLight)

    // Near particles — 10000 points
    const nearCount = 10000
    const nearGeo = new THREE.BufferGeometry()
    const nearPos = new Float32Array(nearCount * 3)
    for (let i = 0; i < nearCount * 3; i++) nearPos[i] = (Math.random() - 0.5) * 260
    nearGeo.setAttribute('position', new THREE.BufferAttribute(nearPos, 3))
    const nearMat = new THREE.PointsMaterial({
      color: 0x1c1c1c,
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9
    })
    const nearParticles = new THREE.Points(nearGeo, nearMat)
    scene.add(nearParticles)

    // Far particles — 3000 points, slower
    const farCount = 3000
    const farGeo = new THREE.BufferGeometry()
    const farPos = new Float32Array(farCount * 3)
    for (let i = 0; i < farCount * 3; i++) farPos[i] = (Math.random() - 0.5) * 380
    farGeo.setAttribute('position', new THREE.BufferAttribute(farPos, 3))
    const farMat = new THREE.PointsMaterial({
      color: 0x0e0e0e,
      size: 0.28,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55
    })
    const farParticles = new THREE.Points(farGeo, farMat)
    scene.add(farParticles)

    // Primary icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(28, 2)
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x111111,
      wireframe: true,
      transparent: true,
      opacity: 0.88
    })
    const ico = new THREE.Mesh(icoGeo, icoMat)
    ico.position.set(25, -10, -22)
    scene.add(ico)

    // Secondary icosahedron
    const ico2Geo = new THREE.IcosahedronGeometry(13, 1)
    const ico2Mat = new THREE.MeshBasicMaterial({
      color: 0x141414,
      wireframe: true,
      transparent: true,
      opacity: 0.82
    })
    const ico2 = new THREE.Mesh(ico2Geo, ico2Mat)
    ico2.position.set(-22, 15, -28)
    scene.add(ico2)

    // Torus knot — elegant detail
    const knotGeo = new THREE.TorusKnotGeometry(6, 1.7, 90, 12)
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0x17142a,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    })
    const knot = new THREE.Mesh(knotGeo, knotMat)
    knot.position.set(-10, -16, -16)
    scene.add(knot)

    let mX = 0
    let mY = 0
    const onMove = (e: MouseEvent): void => {
      mX = e.clientX / window.innerWidth - 0.5
      mY = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMove)

    const clock = new THREE.Clock()

    const animate = (): void => {
      frameRef.current = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      nearParticles.rotation.y += 0.00022
      farParticles.rotation.y += 0.0001
      farParticles.rotation.x = Math.sin(t * 0.05) * 0.04

      ico.rotation.y += 0.0013
      ico.rotation.x += 0.0006

      ico2.rotation.y -= 0.0018
      ico2.rotation.z += 0.0009

      knot.rotation.y += 0.0011
      knot.rotation.x += 0.0007
      const breath = 1 + Math.sin(t * 0.35) * 0.03
      knot.scale.set(breath, breath, breath)

      // Camera drift + mouse parallax
      const targetX = mX * 6 + Math.sin(t * 0.08) * 1
      const targetY = -mY * 6 + Math.cos(t * 0.06) * 0.8
      camera.position.x += (targetX - camera.position.x) * 0.02
      camera.position.y += (targetY - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    const onResize = (): void => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      nearGeo.dispose(); nearMat.dispose()
      farGeo.dispose(); farMat.dispose()
      icoGeo.dispose(); icoMat.dispose()
      ico2Geo.dispose(); ico2Mat.dispose()
      knotGeo.dispose(); knotMat.dispose()
      renderer.dispose()
      if (container.contains(canvasEl)) container.removeChild(canvasEl)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 z-0" />
}

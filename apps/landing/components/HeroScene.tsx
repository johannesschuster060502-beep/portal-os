'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x050505, 1)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      300
    )
    camera.position.set(0, 0, 50)

    // Particles
    const particleCount = 6000
    const pGeo = new THREE.BufferGeometry()
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) pos[i] = (Math.random() - 0.5) * 220
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const pMat = new THREE.PointsMaterial({ color: 0x181818, size: 0.12 })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // Large wireframe icosahedron
    const iGeo = new THREE.IcosahedronGeometry(26, 2)
    const iMat = new THREE.MeshBasicMaterial({ color: 0x0f0f0f, wireframe: true })
    const ico = new THREE.Mesh(iGeo, iMat)
    ico.position.set(22, -10, -20)
    scene.add(ico)

    // Small wireframe
    const sGeo = new THREE.IcosahedronGeometry(12, 1)
    const sMat = new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: true })
    const sph = new THREE.Mesh(sGeo, sMat)
    sph.position.set(-20, 14, -28)
    scene.add(sph)

    let mX = 0, mY = 0
    const onMove = (e: MouseEvent) => {
      mX = e.clientX / window.innerWidth - 0.5
      mY = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMove)

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      particles.rotation.y += 0.00015
      ico.rotation.y += 0.0012
      ico.rotation.x += 0.0006
      sph.rotation.y -= 0.0018
      sph.rotation.z += 0.0008
      camera.position.x += (mX * 5 - camera.position.x) * 0.02
      camera.position.y += (-mY * 5 - camera.position.y) * 0.02
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
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
      pGeo.dispose(); pMat.dispose()
      iGeo.dispose(); iMat.dispose()
      sGeo.dispose(); sMat.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 z-0" />
}

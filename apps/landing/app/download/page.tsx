'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const VERSION = process.env.NEXT_PUBLIC_VERSION || '1.0.2'
const BASE =
  process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL ||
  'https://github.com/johannesschuster060502-beep/portal-os-releases/releases/latest/download'

type Platform = 'windows' | 'macos' | 'linux' | 'unknown'

const platforms = [
  {
    id: 'windows' as Platform,
    name: 'Windows',
    icon: '⊞',
    file: `Portal-OS-Setup-${VERSION}.exe`,
    note: 'Windows 10+ (64-bit)',
    format: 'NSIS Installer (.exe)'
  },
  {
    id: 'macos' as Platform,
    name: 'macOS',
    icon: '⌘',
    file: `Portal-OS-${VERSION}-arm64.dmg`,
    note: 'macOS 11+ (Apple Silicon & Intel)',
    format: 'Disk Image (.dmg)'
  },
  {
    id: 'linux' as Platform,
    name: 'Linux',
    icon: '◆',
    file: `Portal-OS-${VERSION}-x64.AppImage`,
    note: 'Ubuntu 20.04+ / Fedora 36+ (64-bit)',
    format: 'AppImage'
  }
]

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('win')) return 'windows'
  if (ua.includes('mac')) return 'macos'
  if (ua.includes('linux')) return 'linux'
  return 'unknown'
}

export default function DownloadPage() {
  const [detected, setDetected] = useState<Platform>('unknown')

  useEffect(() => {
    setDetected(detectPlatform())
  }, [])

  const sorted = [...platforms].sort((a, b) => {
    if (a.id === detected) return -1
    if (b.id === detected) return 1
    return 0
  })

  return (
    <>
      <Navbar />

      <main className="pt-28 pb-20 px-6 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-[10px] tracking-[0.3em] mb-4"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
            >
              DOWNLOAD
            </p>
            <h1
              className="text-3xl md:text-4xl font-extralight tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Get Portal OS
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Version {VERSION} — Free and open-source
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            {sorted.map((platform, i) => {
              const isDetected = platform.id === detected
              return (
                <motion.a
                  key={platform.id}
                  href={`${BASE}/${platform.file}`}
                  className="flex items-center justify-between p-6 rounded-2xl no-underline
                             transition-all hover:scale-[1.005]"
                  style={{
                    background: isDetected ? 'var(--accent-dim)' : 'var(--bg-surface)',
                    border: isDetected
                      ? '1px solid rgba(124,106,247,0.25)'
                      : '1px solid var(--border-dim)'
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-center gap-5">
                    <span className="text-2xl opacity-40">{platform.icon}</span>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className="text-base font-light"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {platform.name}
                        </span>
                        {isDetected && (
                          <span
                            className="text-[9px] tracking-[0.15em] px-2 py-0.5 rounded-full"
                            style={{
                              background: 'var(--accent)',
                              color: '#fff',
                              fontFamily: 'var(--font-mono)'
                            }}
                          >
                            DETECTED
                          </span>
                        )}
                      </div>
                      <p
                        className="text-[11px]"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {platform.note} — {platform.format}
                      </p>
                    </div>
                  </div>

                  <span
                    className="text-xs tracking-wider px-4 py-2 rounded-lg transition-all"
                    style={{
                      background: isDetected ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                      color: isDetected ? '#fff' : 'var(--text-secondary)',
                      border: isDetected ? 'none' : '1px solid var(--border-subtle)'
                    }}
                  >
                    Download
                  </span>
                </motion.a>
              )
            })}
          </div>

          {/* Release info */}
          <motion.div
            className="mt-12 p-6 rounded-xl text-center"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-dim)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
              All releases are built automatically via GitHub Actions and published to GitHub Releases.
            </p>
            <a
              href="https://github.com/johannesschuster060502-beep/portal-os-releases/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] no-underline transition-opacity hover:opacity-70"
              style={{ color: 'var(--accent)' }}
            >
              View all releases on GitHub →
            </a>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  )
}

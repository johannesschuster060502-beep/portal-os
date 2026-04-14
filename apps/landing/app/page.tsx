'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroScene from '@/components/HeroScene'

const DOWNLOAD_BASE =
  process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL ||
  'https://github.com/johannesschuster060502-beep/portal-os-releases/releases/latest/download'

const features = [
  {
    tag: 'IMMERSIVE',
    title: 'Cinematic New Tab',
    description:
      'A full 3D wireframe scene with mouse parallax, ambient clock, and glass-morphism search. Every new tab is a gallery installation.',
    icon: '◈'
  },
  {
    tag: 'COMMAND',
    title: 'Omnibox — Ctrl+K',
    description:
      'Search open tabs, history, bookmarks, and quick actions in one unified command palette. Navigate your browser like a power user.',
    icon: '⬡'
  },
  {
    tag: 'ENGINE',
    title: 'Full Chromium Core',
    description:
      'Powered by the same Chromium engine as Chrome. Full web compatibility, modern standards, hardware-accelerated rendering.',
    icon: '◉'
  },
  {
    tag: 'PRIVACY',
    title: 'Built-in Protection',
    description:
      'Ad and tracker blocking out of the box. No telemetry, no accounts, no cloud sync. Your data stays on your machine.',
    icon: '⬢'
  }
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
}

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroScene />

        <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="text-6xl md:text-8xl font-extralight tracking-tight"
              style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-display)' }}
            >
              PORTAL OS
            </h1>
          </motion.div>

          <motion.p
            className="text-sm md:text-base tracking-wider max-w-md"
            style={{ color: 'var(--text-tertiary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            The browser that thinks differently.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Link
              href="/download"
              className="px-6 py-3 rounded-xl text-sm tracking-wider no-underline transition-all
                         hover:brightness-110 hover:scale-[1.02]"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Download Now
            </Link>
            <a
              href="https://github.com/johannesschuster060502-beep/portal-os-releases"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl text-sm tracking-wider no-underline transition-all
                         hover:bg-white/5"
              style={{ border: '1px solid var(--border-mid)', color: 'var(--text-secondary)' }}
            >
              View on GitHub
            </a>
          </motion.div>

          <motion.p
            className="text-[10px] tracking-[0.2em] mt-8"
            style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            WINDOWS · MACOS · LINUX
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-[9px] tracking-[0.2em]" style={{ color: 'var(--text-disabled)' }}>
            SCROLL
          </span>
          <motion.div
            className="w-px h-6"
            style={{ background: 'var(--border-mid)' }}
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
          >
            <p
              className="text-[10px] tracking-[0.3em] mb-4"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
            >
              FEATURES
            </p>
            <h2
              className="text-3xl md:text-4xl font-extralight tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Not a skin. A rethink.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="p-8 rounded-2xl transition-colors"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-dim)'
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                custom={i}
                whileHover={{
                  borderColor: 'rgba(255,255,255,0.12)',
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl opacity-40">{feature.icon}</span>
                  <span
                    className="text-[9px] tracking-[0.2em]"
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                  >
                    {feature.tag}
                  </span>
                </div>
                <h3
                  className="text-lg font-light mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-2xl mx-auto"
        >
          <h2
            className="text-3xl md:text-5xl font-extralight tracking-tight mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Ready to browse differently?
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-tertiary)' }}>
            Portal OS is free, open-source, and built for people who care about how their tools feel.
          </p>
          <Link
            href="/download"
            className="inline-block px-8 py-3.5 rounded-xl text-sm tracking-wider no-underline
                       transition-all hover:brightness-110 hover:scale-[1.02]"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Download Portal OS
          </Link>
        </motion.div>
      </section>

      <Footer />
    </>
  )
}

'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroScene from '@/components/HeroScene'
import { useLang } from '@/context/LangContext'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
    }
  })
}

export default function Home() {
  const { t } = useLang()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94])

  return (
    <>
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <HeroScene />

        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 45%, rgba(124,106,247,0.07) 0%, rgba(0,0,0,0) 65%)'
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none z-[1]"
          style={{
            height: '20vh',
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.6) 0%, rgba(5,5,5,0) 100%)'
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-[1]"
          style={{
            height: '25vh',
            background: 'linear-gradient(to top, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0) 100%)'
          }}
        />

        <motion.div
          className="relative z-10 flex flex-col items-center gap-7 text-center"
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            padding: 'clamp(24px, 3vw, 48px)',
            maxWidth: 'min(1100px, 92vw)'
          }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            <div className="h-px w-12" style={{ background: 'rgba(124,106,247,0.4)' }} />
            <span
              className="tracking-[0.3em]"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(9px, 0.7vw, 11px)',
                color: 'var(--accent)'
              }}
            >
              {t.home.eyebrow}
            </span>
            <div className="h-px w-12" style={{ background: 'rgba(124,106,247,0.4)' }} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24, letterSpacing: '0.02em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '-0.04em' }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-extralight leading-none"
            style={{
              fontSize: 'clamp(56px, 9vw, 180px)',
              color: 'rgba(255,255,255,0.96)',
              fontFamily: 'var(--font-display)',
              textShadow: '0 0 80px rgba(124,106,247,0.15)'
            }}
          >
            PORTAL OS
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl tracking-wider whitespace-pre-line"
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: 'clamp(13px, 1.1vw, 17px)',
              lineHeight: 1.6
            }}
          >
            {t.home.subtitle}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-3 mt-4"
          >
            <Link
              href="/download"
              className="group relative overflow-hidden px-8 py-4 rounded-2xl tracking-wider no-underline transition-all"
              style={{
                background: 'var(--accent)',
                color: '#fff',
                fontSize: 'clamp(13px, 1vw, 15px)',
                boxShadow: '0 20px 60px rgba(124,106,247,0.35), 0 0 0 1px rgba(255,255,255,0.1) inset'
              }}
            >
              <span className="relative z-10">{t.home.downloadBtn}</span>
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{
                  background:
                    'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)'
                }}
              />
            </Link>
            <a
              href="https://github.com/johannesschuster060502-beep/portal-os"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl tracking-wider no-underline transition-all hover:bg-white/5 hover:scale-[1.02]"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: 'clamp(13px, 1vw, 15px)'
              }}
            >
              {t.home.githubBtn}
            </a>
          </motion.div>

          {/* Platform hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="tracking-[0.25em]"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(9px, 0.65vw, 10px)',
              color: 'var(--text-disabled)',
              marginTop: '1rem'
            }}
          >
            {t.home.platforms}
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <span
            className="tracking-[0.25em]"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-disabled)' }}
          >
            {t.home.scroll}
          </span>
          <motion.div
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }}
            animate={{ scaleY: [1, 0.3, 1], originY: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ═══════════ PHILOSOPHY ═══════════ */}
      <section
        style={{
          padding: 'clamp(80px, 10vh, 140px) clamp(24px, 3vw, 80px)',
          background: 'var(--bg-void)',
          borderTop: '1px solid var(--border-dim)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 shrink-0" style={{ background: 'rgba(124,106,247,0.4)' }} />
              <p
                className="tracking-[0.3em]"
                style={{
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(10px, 0.75vw, 11px)'
                }}
              >
                {t.home.philosophyLabel}
              </p>
            </div>
            <h2
              className="font-extralight tracking-tight whitespace-pre-line mb-8"
              style={{
                fontSize: 'clamp(36px, 5vw, 72px)',
                color: 'rgba(255,255,255,0.94)',
                lineHeight: 1.05
              }}
            >
              {t.home.philosophyTitle}
            </h2>
            <p
              className="max-w-2xl"
              style={{
                fontSize: 'clamp(13px, 1vw, 16px)',
                color: 'var(--text-tertiary)',
                lineHeight: 1.85
              }}
            >
              {t.home.philosophyDesc}
            </p>
          </motion.div>

          {/* Three pillars */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-px"
            style={{ background: 'var(--border-dim)' }}
          >
            {t.home.principles.map((p, i) => (
              <motion.div
                key={p.title}
                className="p-10"
                style={{ background: 'var(--bg-void)' }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={i + 1}
              >
                <div
                  className="text-xl mb-8 opacity-20"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {p.glyph}
                </div>
                <h3
                  className="font-light mb-4"
                  style={{
                    fontSize: 'clamp(16px, 1.3vw, 20px)',
                    color: 'rgba(255,255,255,0.9)',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: 'clamp(12px, 0.9vw, 14px)',
                    color: 'var(--text-tertiary)',
                    lineHeight: 1.85
                  }}
                >
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section
        id="features"
        className="relative py-32"
        style={{
          padding: 'clamp(80px, 10vh, 160px) clamp(24px, 3vw, 80px)',
          background: 'linear-gradient(to bottom, rgba(5,5,5,1) 0%, rgba(8,8,8,1) 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10" style={{ background: 'rgba(124,106,247,0.4)' }} />
              <p
                className="tracking-[0.3em]"
                style={{
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(10px, 0.75vw, 11px)'
                }}
              >
                {t.home.featuresLabel}
              </p>
              <div className="h-px w-10" style={{ background: 'rgba(124,106,247,0.4)' }} />
            </div>
            <h2
              className="font-extralight tracking-tight"
              style={{ fontSize: 'clamp(36px, 5vw, 72px)', color: 'rgba(255,255,255,0.94)', lineHeight: 1.05 }}
            >
              {t.home.featuresTitle1}
              <br />
              {t.home.featuresTitle2}
            </h2>
            <p
              className="max-w-xl mx-auto mt-6"
              style={{ fontSize: 'clamp(13px, 1vw, 16px)', color: 'var(--text-tertiary)', lineHeight: 1.7 }}
            >
              {t.home.featuresSubtitle}
            </p>
          </motion.div>

          <div
            className="grid gap-4 md:gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' }}
          >
            {t.home.features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="p-8 rounded-3xl transition-all group cursor-default"
                style={{
                  background: 'rgba(15,15,15,0.6)',
                  border: '1px solid var(--border-dim)',
                  backdropFilter: 'blur(12px)'
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={i}
                whileHover={{ borderColor: 'rgba(124,106,247,0.3)', y: -2, transition: { duration: 0.3 } }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all group-hover:bg-[var(--accent-dim)]"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-subtle)',
                      color: 'rgba(255,255,255,0.7)'
                    }}
                  >
                    {feature.glyph}
                  </div>
                  <span
                    className="tracking-[0.2em]"
                    style={{
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(9px, 0.7vw, 10px)'
                    }}
                  >
                    {feature.tag}
                  </span>
                </div>
                <h3
                  className="font-light mb-3"
                  style={{
                    fontSize: 'clamp(18px, 1.5vw, 22px)',
                    color: 'rgba(255,255,255,0.92)',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: 'clamp(12px, 0.9vw, 14px)', color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TECH STACK ═══════════ */}
      <section
        className="relative"
        style={{ padding: 'clamp(80px, 10vh, 140px) clamp(24px, 3vw, 80px)', background: 'var(--bg-base)' }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            className="tracking-[0.3em] mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(10px, 0.75vw, 11px)' }}
          >
            {t.home.techLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-extralight tracking-tight mb-6"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: 'rgba(255,255,255,0.94)' }}
          >
            {t.home.techTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto mb-16"
            style={{
              fontSize: 'clamp(12px, 0.9vw, 14px)',
              color: 'var(--text-tertiary)',
              lineHeight: 1.8
            }}
          >
            {t.home.techDesc}
          </motion.p>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px"
            style={{ background: 'var(--border-dim)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {[
              { label: 'Electron', v: '33' },
              { label: 'Chromium', v: '130+' },
              { label: 'React', v: '18.3' },
              { label: 'TypeScript', v: '5.8' },
              { label: 'Three.js', v: '0.172' },
              { label: 'Framer Motion', v: '12' },
              { label: 'Zustand', v: '5' },
              { label: 'SQLite', v: '11' }
            ].map((tech) => (
              <div
                key={tech.label}
                className="p-6 flex flex-col items-center justify-center"
                style={{ background: 'var(--bg-base)' }}
              >
                <div
                  className="font-light mb-1"
                  style={{ fontSize: 'clamp(13px, 1.1vw, 16px)', color: 'rgba(255,255,255,0.88)' }}
                >
                  {tech.label}
                </div>
                <div
                  className="tracking-wider"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(9px, 0.7vw, 10px)',
                    color: 'var(--text-disabled)'
                  }}
                >
                  v{tech.v}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section
        className="relative text-center"
        style={{
          padding: 'clamp(100px, 12vh, 180px) clamp(24px, 3vw, 80px)',
          background: 'linear-gradient(to bottom, var(--bg-base) 0%, var(--bg-void) 100%)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <h2
            className="font-extralight tracking-tight mb-8"
            style={{ fontSize: 'clamp(40px, 5.5vw, 88px)', color: 'rgba(255,255,255,0.96)', lineHeight: 1.05 }}
          >
            {t.home.ctaTitle1}
            <br className="sm:hidden" /> {t.home.ctaTitle2}
          </h2>
          <p
            className="mb-10"
            style={{ fontSize: 'clamp(13px, 1.05vw, 16px)', color: 'var(--text-tertiary)', lineHeight: 1.7 }}
          >
            {t.home.ctaDesc}
          </p>
          <Link
            href="/download"
            className="inline-block px-10 py-4 rounded-2xl tracking-wider no-underline transition-all hover:scale-[1.03]"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              fontSize: 'clamp(13px, 1vw, 15px)',
              boxShadow: '0 20px 60px rgba(124,106,247,0.35)'
            }}
          >
            {t.home.ctaBtn}
          </Link>
        </motion.div>
      </section>

      <Footer />
    </>
  )
}

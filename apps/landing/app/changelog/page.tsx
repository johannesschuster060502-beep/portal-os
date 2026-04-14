'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useLang } from '@/context/LangContext'

export default function ChangelogPage() {
  const { t } = useLang()

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
              {t.changelog.eyebrow}
            </p>
            <h1
              className="text-3xl md:text-4xl font-extralight tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {t.changelog.title}
            </h1>
          </motion.div>

          <div className="flex flex-col gap-8">
            {t.changelog.releases.map((release, i) => (
              <motion.div
                key={release.version}
                className="relative pl-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {/* Timeline line */}
                <div
                  className="absolute left-[11px] top-3 bottom-0 w-px"
                  style={{ background: 'var(--border-dim)' }}
                />
                {/* Timeline dot */}
                <div
                  className="absolute left-1.5 top-2 w-3 h-3 rounded-full"
                  style={{ background: 'var(--accent)', boxShadow: '0 0 8px rgba(124,106,247,0.4)' }}
                />

                <div
                  className="p-6 rounded-xl"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-dim)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-base font-light" style={{ color: 'var(--text-primary)' }}>
                      v{release.version}
                    </span>
                    <span
                      className="text-[9px] tracking-[0.15em] px-2 py-0.5 rounded-full"
                      style={{
                        background: 'var(--accent-dim)',
                        color: 'var(--accent)',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {release.tag}
                    </span>
                    <span
                      className="text-[10px] ml-auto"
                      style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
                    >
                      {release.date}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2">
                    {release.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-[12px] leading-relaxed"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-white/15" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

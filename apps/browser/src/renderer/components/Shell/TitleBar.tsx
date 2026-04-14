import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Minus, Square, CornersOut, X, Lightning, GearSix } from '@phosphor-icons/react'
import AddressBar from './AddressBar'
import NavControls from './NavControls'
import { useI18nStore } from '@store/i18n.store'
import { useUIStore } from '@store/ui.store'
import { springSnappy, tapPress } from '@lib/motion'

export default function TitleBar(): JSX.Element {
  const [isMaximized, setIsMaximized] = useState(false)
  const isMac = window.portalOS.platform === 'darwin'
  const t = useI18nStore((s) => s.t)
  const openStudox = useUIStore((s) => s.openStudoxCore)
  const toggleSettings = useUIStore((s) => s.toggleSettings)

  useEffect(() => {
    window.portalOS.shell.isMaximized().then(setIsMaximized)
    const unsub = window.portalOS.shell.onMaximizeChanged(setIsMaximized)
    return unsub
  }, [])

  return (
    <div
      className="relative flex items-center h-11 shrink-0 drag-region"
      style={{
        background: 'rgba(8,8,8,0.94)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border-dim)',
        paddingLeft: 'clamp(10px, 1vw, 16px)',
        paddingRight: 0
      }}
    >
      {/* ── LEFT SIDE ── */}
      {/* macOS traffic lights placeholder */}
      {isMac && <div className="w-16 shrink-0 drag-region" />}

      {/* STUDOX Core button — prominent, leftmost */}
      <motion.button
        onClick={openStudox}
        className="no-drag flex items-center gap-2 shrink-0 rounded-lg mr-2 relative overflow-hidden group"
        style={{
          height: 30,
          padding: '0 12px',
          background:
            'linear-gradient(135deg, rgba(124,106,247,0.14) 0%, rgba(124,106,247,0.06) 100%)',
          border: '1px solid rgba(124,106,247,0.28)',
          boxShadow: '0 0 0 0 rgba(124,106,247,0), inset 0 1px 0 rgba(255,255,255,0.06)'
        }}
        whileHover={{
          scale: 1.03,
          boxShadow:
            '0 0 0 3px rgba(124,106,247,0.1), 0 6px 20px rgba(124,106,247,0.22), inset 0 1px 0 rgba(255,255,255,0.12)'
        }}
        whileTap={tapPress}
        transition={springSnappy}
        aria-label={t.studox.coreButtonLabel}
        title={t.studox.coreButtonLabel}
      >
        {/* Shimmer sweep */}
        <motion.span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-120%' }}
          whileHover={{ x: '120%' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            background:
              'linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.16) 50%, transparent 65%)'
          }}
        />
        <Lightning size={13} weight="fill" style={{ color: 'var(--accent)' }} />
        <span
          className="tracking-[0.14em] hidden md:inline"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 500
          }}
        >
          STUDOX CORE
        </span>
      </motion.button>

      {/* Nav controls */}
      <div className="no-drag shrink-0">
        <NavControls />
      </div>

      {/* ── CENTER: Address bar ── */}
      <div
        className="no-drag flex-1 flex justify-center px-2"
        style={{ minWidth: 0 }}
      >
        <div className="w-full" style={{ maxWidth: 'clamp(320px, 58vw, 860px)' }}>
          <AddressBar />
        </div>
      </div>

      {/* ── RIGHT SIDE ── */}
      {/* Settings cog */}
      <motion.button
        onClick={() => toggleSettings()}
        className="no-drag w-9 h-9 flex items-center justify-center rounded-lg shrink-0 opacity-50 hover:opacity-90 hover:bg-white/5 transition-colors mr-1"
        aria-label={t.settings.title}
        title={t.settings.title}
        whileTap={tapPress}
        transition={springSnappy}
      >
        <GearSix size={15} />
      </motion.button>

      {/* Window controls — Windows/Linux only */}
      {!isMac && (
        <div className="no-drag flex items-center shrink-0">
          <motion.button
            onClick={() => window.portalOS.shell.minimize()}
            className="w-11 h-11 flex items-center justify-center opacity-50 hover:opacity-90 hover:bg-white/5 transition-colors"
            aria-label={t.shell.minimize}
            whileTap={tapPress}
            transition={springSnappy}
          >
            <Minus size={14} />
          </motion.button>
          <motion.button
            onClick={() => window.portalOS.shell.maximize()}
            className="w-11 h-11 flex items-center justify-center opacity-50 hover:opacity-90 hover:bg-white/5 transition-colors"
            aria-label={isMaximized ? t.shell.restore : t.shell.maximize}
            whileTap={tapPress}
            transition={springSnappy}
          >
            {isMaximized ? <CornersOut size={13} /> : <Square size={11} />}
          </motion.button>
          <motion.button
            onClick={() => window.portalOS.shell.close()}
            className="w-11 h-11 flex items-center justify-center opacity-50 hover:opacity-90 hover:bg-red-500/25 hover:text-red-300 transition-colors"
            aria-label={t.shell.close}
            whileTap={tapPress}
            transition={springSnappy}
          >
            <X size={14} />
          </motion.button>
        </div>
      )}
    </div>
  )
}

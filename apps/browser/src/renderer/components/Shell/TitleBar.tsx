import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Square, CornersOut, X, Lightning, GearSix, ArrowDown, PuzzlePiece } from '@phosphor-icons/react'
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
  const toggleDownloads = useUIStore((s) => s.toggleDownloads)
  const toggleExtensions = useUIStore((s) => s.toggleExtensions)
  const activeDownloadsCount = useUIStore((s) => s.activeDownloadsCount)
  const downloadsOpen = useUIStore((s) => s.downloadsOpen)
  const extensionsOpen = useUIStore((s) => s.extensionsOpen)

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
      {isMac && <div className="w-16 shrink-0 drag-region" />}

      {/* STUDOX Core button */}
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
      <div className="no-drag flex-1 flex justify-center px-2" style={{ minWidth: 0 }}>
        <div className="w-full" style={{ maxWidth: 'clamp(320px, 58vw, 860px)' }}>
          <AddressBar />
        </div>
      </div>

      {/* ── RIGHT SIDE ── */}

      {/* Extensions button — puzzle piece icon, like Chrome */}
      <motion.button
        onClick={() => toggleExtensions()}
        className="no-drag w-9 h-9 flex items-center justify-center rounded-lg shrink-0 transition-colors relative"
        style={{
          opacity: extensionsOpen ? 1 : undefined,
          background: extensionsOpen ? 'rgba(124,106,247,0.12)' : undefined,
          color: extensionsOpen ? 'var(--accent)' : undefined
        }}
        aria-label={t.extensions?.title ?? 'Extensions'}
        title={t.extensions?.title ?? 'Extensions'}
        whileTap={tapPress}
        transition={springSnappy}
      >
        <PuzzlePiece
          size={15}
          className={extensionsOpen ? '' : 'opacity-50 hover:opacity-90'}
          weight={extensionsOpen ? 'fill' : 'regular'}
        />
      </motion.button>

      {/* Downloads button — arrow-down icon with optional active badge */}
      <motion.button
        onClick={() => toggleDownloads()}
        className="no-drag w-9 h-9 flex items-center justify-center rounded-lg shrink-0 transition-colors relative mr-1"
        style={{
          opacity: downloadsOpen ? 1 : undefined,
          background: downloadsOpen ? 'rgba(124,106,247,0.12)' : undefined,
          color: downloadsOpen ? 'var(--accent)' : undefined
        }}
        aria-label={t.sidebar?.downloads ?? 'Downloads'}
        title={t.sidebar?.downloads ?? 'Downloads'}
        whileTap={tapPress}
        transition={springSnappy}
      >
        <ArrowDown
          size={15}
          className={downloadsOpen ? '' : 'opacity-50 hover:opacity-90'}
          weight={downloadsOpen ? 'bold' : 'regular'}
        />
        {/* Active download badge */}
        <AnimatePresence>
          {activeDownloadsCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-1.5 right-1.5 rounded-full flex items-center justify-center"
              style={{
                width: 8,
                height: 8,
                background: 'var(--accent)',
                boxShadow: '0 0 6px rgba(124,106,247,0.8)'
              }}
            />
          )}
        </AnimatePresence>
      </motion.button>

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

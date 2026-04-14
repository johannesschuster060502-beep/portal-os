import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Minus, Square, CornersOut, X } from '@phosphor-icons/react'
import AddressBar from './AddressBar'
import NavControls from './NavControls'
import { springSnappy, tapPress } from '@lib/motion'

export default function TitleBar(): JSX.Element {
  const [isMaximized, setIsMaximized] = useState(false)
  const isMac = window.portalOS.platform === 'darwin'

  useEffect(() => {
    // Get initial state
    window.portalOS.shell.isMaximized().then(setIsMaximized)

    // Listen for changes
    const unsub = window.portalOS.shell.onMaximizeChanged(setIsMaximized)
    return unsub
  }, [])

  return (
    <div
      className="drag-region flex items-center h-10 px-3 gap-2 shrink-0"
      style={{
        background: 'rgba(8,8,8,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-dim)'
      }}
    >
      {/* macOS traffic lights placeholder */}
      {isMac && <div className="w-16 shrink-0" />}

      {/* Logo */}
      <div className="no-drag flex items-center gap-2 shrink-0 mr-2">
        <span className="text-sm opacity-60" style={{ fontFamily: 'var(--font-mono)' }}>
          ⬡
        </span>
        <span
          className="text-[11px] tracking-[0.12em] opacity-40 hidden sm:inline"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          PORTAL OS
        </span>
      </div>

      {/* Nav controls */}
      <div className="no-drag shrink-0">
        <NavControls />
      </div>

      {/* Address bar — takes remaining space */}
      <div className="no-drag flex-1 mx-2">
        <AddressBar />
      </div>

      {/* Window controls — Windows/Linux only */}
      {!isMac && (
        <div className="no-drag flex items-center">
          <motion.button
            onClick={() => window.portalOS.shell.minimize()}
            className="w-10 h-10 flex items-center justify-center opacity-40 hover:opacity-80
                       hover:bg-white/5 transition-colors"
            aria-label="Minimize"
            whileTap={tapPress}
            transition={springSnappy}
          >
            <Minus size={14} />
          </motion.button>
          <motion.button
            onClick={() => window.portalOS.shell.maximize()}
            className="w-10 h-10 flex items-center justify-center opacity-40 hover:opacity-80
                       hover:bg-white/5 transition-colors"
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
            whileTap={tapPress}
            transition={springSnappy}
          >
            {isMaximized ? <CornersOut size={14} /> : <Square size={12} />}
          </motion.button>
          <motion.button
            onClick={() => window.portalOS.shell.close()}
            className="w-10 h-10 flex items-center justify-center opacity-40 hover:opacity-80
                       hover:bg-red-500/20 hover:text-red-400 transition-colors"
            aria-label="Close"
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

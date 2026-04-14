import { useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  label: string
  children: ReactNode
  shortcut?: string
}

export default function Tooltip({ label, children, shortcut }: TooltipProps): JSX.Element {
  const [show, setShow] = useState(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-1 rounded-md
                       whitespace-nowrap z-50 pointer-events-none flex items-center gap-2"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
            }}
          >
            <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              {label}
            </span>
            {shortcut && (
              <span
                className="text-[10px] px-1 py-0.5 rounded"
                style={{
                  color: 'var(--text-tertiary)',
                  background: 'rgba(255,255,255,0.05)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {shortcut}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

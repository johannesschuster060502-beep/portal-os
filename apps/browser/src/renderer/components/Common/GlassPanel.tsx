import { motion, HTMLMotionProps } from 'framer-motion'
import { forwardRef, ReactNode } from 'react'

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  blur?: number
  opacity?: number
  border?: boolean
  className?: string
}

const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, blur = 16, opacity = 0.85, border = true, className = '', ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={`${className}`}
        style={{
          background: `rgba(8, 8, 8, ${opacity})`,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          border: border ? '1px solid var(--border-mid)' : 'none',
          ...props.style
        }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

GlassPanel.displayName = 'GlassPanel'
export default GlassPanel

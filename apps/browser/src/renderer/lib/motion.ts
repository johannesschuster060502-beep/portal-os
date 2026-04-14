import type { Transition, Variants } from 'framer-motion'

/**
 * Portal OS — Motion System
 * Centralized spring constants for consistent, Triple-A animations.
 * Use these everywhere. Never write custom transition objects inline.
 */

// ── Springs ──

/** Snappy — UI responses (button presses, toggles, hover states) */
export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
  mass: 0.8
}

/** Standard — panels, overlays, modal entries */
export const springStandard: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 1
}

/** Elastic — tab open/close, satisfying moments with slight overshoot */
export const springElastic: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 22,
  mass: 1
}

/** Slow — boot sequences, scene transitions, deliberate moments */
export const springSlow: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 20,
  mass: 1.5
}

// ── Variants ──

/** Standard overlay entry/exit — used by Omnibox, Settings, HistoryPanel */
export const overlayVariants: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 }
}

/** Tab entry/exit — elastic width collapse */
export const tabVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0, width: 0, marginRight: 0 },
  visible: { scale: 1, opacity: 1, width: 'auto', marginRight: 2 },
  exit: { scale: 0.85, opacity: 0, width: 0, marginRight: 0 }
}

/** Slide-up bars (DownloadBar, UpdateBar, FindBar) */
export const slideUpVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: 40, opacity: 0 }
}

/** Slide-in-from-left (Sidebar) */
export const slideLeftVariants: Variants = {
  hidden: { x: -260, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -260, opacity: 0 }
}

// ── Interaction presets ──

/** Button whileTap */
export const tapPress = { scale: 0.92 }

/** Button whileHover (subtle lift) */
export const hoverLift = { y: -1 }

/** Icon whileHover (satisfying bounce) */
export const hoverBounce = { y: -2, scale: 1.05 }

// ── Durations (for non-spring things like fades) ──
export const duration = {
  fast: 0.12,
  mid: 0.22,
  slow: 0.4,
  cinematic: 0.8
} as const

// ── Easing (cubic-bezier) for non-spring cases ──
export const ease = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number]
}

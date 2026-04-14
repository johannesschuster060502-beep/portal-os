import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowClockwise, X } from '@phosphor-icons/react'
import { useTabsStore } from '@store/tabs.store'
import { springSnappy, tapPress } from '@lib/motion'

export default function NavControls(): JSX.Element {
  const tabs = useTabsStore((s) => s.tabs)
  const activeTabId = useTabsStore((s) => s.activeTabId)
  const goBack = useTabsStore((s) => s.goBack)
  const goForward = useTabsStore((s) => s.goForward)
  const reload = useTabsStore((s) => s.reload)
  const stopLoading = useTabsStore((s) => s.stopLoading)

  const activeTab = tabs.find((t) => t.id === activeTabId)
  const canGoBack = activeTab?.canGoBack ?? false
  const canGoForward = activeTab?.canGoForward ?? false
  const isLoading = activeTab?.isLoading ?? false

  return (
    <div className="flex items-center gap-0.5">
      <motion.button
        onClick={goBack}
        disabled={!canGoBack}
        className="w-7 h-7 flex items-center justify-center rounded-md transition-colors
                   disabled:opacity-15 opacity-40 hover:opacity-80 hover:bg-white/5"
        aria-label="Go back"
        whileTap={canGoBack ? tapPress : undefined}
        transition={springSnappy}
      >
        <ArrowLeft size={14} />
      </motion.button>
      <motion.button
        onClick={goForward}
        disabled={!canGoForward}
        className="w-7 h-7 flex items-center justify-center rounded-md transition-colors
                   disabled:opacity-15 opacity-40 hover:opacity-80 hover:bg-white/5"
        aria-label="Go forward"
        whileTap={canGoForward ? tapPress : undefined}
        transition={springSnappy}
      >
        <ArrowRight size={14} />
      </motion.button>
      <motion.button
        onClick={isLoading ? stopLoading : reload}
        className="w-7 h-7 flex items-center justify-center rounded-md transition-colors
                   opacity-40 hover:opacity-80 hover:bg-white/5"
        aria-label={isLoading ? 'Stop loading' : 'Reload'}
        whileTap={tapPress}
        transition={springSnappy}
      >
        {isLoading ? <X size={14} /> : <ArrowClockwise size={14} />}
      </motion.button>
    </div>
  )
}

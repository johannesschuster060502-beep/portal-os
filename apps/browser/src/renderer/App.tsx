import { useEffect, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useUIStore } from '@store/ui.store'
import { useTabsStore, TabState } from '@store/tabs.store'
import { useSettingsStore } from '@store/settings.store'
import { useI18nStore } from '@store/i18n.store'
import { useGroupsStore } from '@store/groups.store'
import { useShortcuts } from '@hooks/useShortcuts'
import BootScreen from '@components/Boot/BootScreen'
import TitleBar from '@components/Shell/TitleBar'
import TabBar from '@components/Shell/TabBar'
import NewTabPage from '@components/NewTab/NewTabPage'

const Omnibox = lazy(() => import('@components/Overlays/Omnibox'))
const Settings = lazy(() => import('@components/Overlays/Settings'))
const HistoryPanel = lazy(() => import('@components/Overlays/HistoryPanel'))
const Sidebar = lazy(() => import('@components/Shell/Sidebar'))
const FindBar = lazy(() => import('@components/Overlays/FindBar'))
const DownloadBar = lazy(() => import('@components/Overlays/DownloadBar'))
const UpdateBar = lazy(() => import('@components/Overlays/UpdateBar'))
const StudoxCoreOverlay = lazy(() => import('@components/Overlays/StudoxCoreOverlay'))

export default function App(): JSX.Element {
  const booted = useUIStore((s) => s.booted)
  const omniboxOpen = useUIStore((s) => s.omniboxOpen)
  const settingsOpen = useUIStore((s) => s.settingsOpen)
  const historyOpen = useUIStore((s) => s.historyOpen)
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const findOpen = useUIStore((s) => s.findOpen)
  const activeTabId = useTabsStore((s) => s.activeTabId)
  const tabs = useTabsStore((s) => s.tabs)
  const setTabs = useTabsStore((s) => s.setTabs)
  const updateTab = useTabsStore((s) => s.updateTab)
  const t = useI18nStore((s) => s.t)

  useShortcuts()

  useEffect(() => {
    // Load user preferences from SQLite
    useSettingsStore.getState().loadFromDB()
    useI18nStore.getState().loadFromDB()
    useGroupsStore.getState().loadFromDB()

    const unsubUpdated = window.portalOS.tabs.onUpdated((state) => {
      updateTab(state as TabState)
    })
    const unsubActivated = window.portalOS.tabs.onActivated((id) => {
      useTabsStore.setState({ activeTabId: id })
    })
    const unsubList = window.portalOS.tabs.onListChanged((tabList) => {
      setTabs(tabList as TabState[])
    })

    return () => {
      unsubUpdated()
      unsubActivated()
      unsubList()
    }
  }, [setTabs, updateTab])

  useEffect(() => {
    if (booted && tabs.length === 0) {
      window.portalOS.tabs.create()
    }
  }, [booted, tabs.length])

  const activeTab = tabs.find((t) => t.id === activeTabId)
  const showNewTab = activeTab?.isInternalPage ?? true

  return (
    <div className="flex flex-col w-full h-full bg-void">
      <AnimatePresence mode="wait">
        {!booted && <BootScreen key="boot" />}
      </AnimatePresence>

      {booted && (
        <>
          <TitleBar />
          <TabBar />

          <div id="main-content" className="relative flex-1 overflow-hidden" role="main">
            {/* Sidebar */}
            <AnimatePresence>
              {sidebarOpen && (
                <Suspense fallback={null}>
                  <Sidebar />
                </Suspense>
              )}
            </AnimatePresence>

            {/* Find bar */}
            <AnimatePresence>
              {findOpen && !showNewTab && (
                <Suspense fallback={null}>
                  <FindBar />
                </Suspense>
              )}
            </AnimatePresence>

            {/* New tab page */}
            {showNewTab && <NewTabPage />}

            {/* Web content area */}
            {!showNewTab && (
              <div className="flex-1 h-full" style={{ background: 'var(--bg-void)' }}>
                {activeTab?.isCrashed && (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <span className="text-5xl opacity-15">⚠</span>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      This page has crashed.
                    </p>
                    <button
                      onClick={() => useTabsStore.getState().reload()}
                      className="px-5 py-2.5 rounded-lg text-[12px] transition-all hover:bg-white/5"
                      style={{
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      ↺ {t.shell.reload}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Download bar + Update bar */}
            <Suspense fallback={null}>
              <DownloadBar />
              <UpdateBar />
            </Suspense>
          </div>

          {/* Overlays */}
          <Suspense fallback={null}>
            <AnimatePresence>
              {omniboxOpen && <Omnibox key="omnibox" />}
            </AnimatePresence>
            <AnimatePresence>
              {settingsOpen && <Settings key="settings" />}
            </AnimatePresence>
            <AnimatePresence>
              {historyOpen && <HistoryPanel key="history" />}
            </AnimatePresence>
          </Suspense>

          {/* STUDOX Core cyberpunk transition — always mounted so it can animate cleanly */}
          <Suspense fallback={null}>
            <StudoxCoreOverlay />
          </Suspense>
        </>
      )}
    </div>
  )
}

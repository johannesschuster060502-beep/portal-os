import { create } from 'zustand'
import { useTabsStore } from './tabs.store'

interface UIStore {
  booted: boolean
  sidebarOpen: boolean
  omniboxOpen: boolean
  settingsOpen: boolean
  historyOpen: boolean
  findOpen: boolean
  isMaximized: boolean
  // STUDOX Core cyberpunk transition
  studoxTransitioning: boolean
  // Settings deep-link to section
  settingsSection: string

  setBoot: (booted: boolean) => void
  toggleSidebar: () => void
  setSidebar: (open: boolean) => void
  toggleOmnibox: () => void
  setOmnibox: (open: boolean) => void
  toggleSettings: (section?: string) => void
  setSettings: (open: boolean, section?: string) => void
  toggleHistory: () => void
  setHistoryOpen: (open: boolean) => void
  toggleFind: () => void
  setFindOpen: (open: boolean) => void
  setMaximized: (maximized: boolean) => void
  openStudoxCore: () => void
  setStudoxTransitioning: (v: boolean) => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  booted: false,
  sidebarOpen: false,
  omniboxOpen: false,
  settingsOpen: false,
  historyOpen: false,
  findOpen: false,
  isMaximized: false,
  studoxTransitioning: false,
  settingsSection: 'general',

  setBoot: (booted) => set({ booted }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar: (open) => set({ sidebarOpen: open }),
  toggleOmnibox: () => set((s) => ({ omniboxOpen: !s.omniboxOpen })),
  setOmnibox: (open) => set({ omniboxOpen: open }),
  toggleSettings: (section) =>
    set((s) => ({
      settingsOpen: !s.settingsOpen,
      settingsSection: section ?? s.settingsSection
    })),
  setSettings: (open, section) =>
    set((s) => ({
      settingsOpen: open,
      settingsSection: section ?? s.settingsSection
    })),
  toggleHistory: () => set((s) => ({ historyOpen: !s.historyOpen })),
  setHistoryOpen: (open) => set({ historyOpen: open }),
  toggleFind: () => set((s) => ({ findOpen: !s.findOpen })),
  setFindOpen: (open) => set({ findOpen: open }),
  setMaximized: (maximized) => set({ isMaximized: maximized }),

  openStudoxCore: () => {
    // Start cyberpunk glitch transition
    set({ studoxTransitioning: true })
    // After 1.4s (middle of the animation), navigate
    setTimeout(() => {
      useTabsStore.getState().navigateTo('https://core.studox.eu')
    }, 1400)
    // After 2s total, hide overlay
    setTimeout(() => {
      set({ studoxTransitioning: false })
    }, 2000)
  },
  setStudoxTransitioning: (v) => set({ studoxTransitioning: v })
}))

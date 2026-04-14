import { create } from 'zustand'

interface UIStore {
  booted: boolean
  sidebarOpen: boolean
  omniboxOpen: boolean
  settingsOpen: boolean
  historyOpen: boolean
  findOpen: boolean
  isMaximized: boolean
  setBoot: (booted: boolean) => void
  toggleSidebar: () => void
  setSidebar: (open: boolean) => void
  toggleOmnibox: () => void
  setOmnibox: (open: boolean) => void
  toggleSettings: () => void
  setSettings: (open: boolean) => void
  toggleHistory: () => void
  setHistoryOpen: (open: boolean) => void
  toggleFind: () => void
  setFindOpen: (open: boolean) => void
  setMaximized: (maximized: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  booted: false,
  sidebarOpen: false,
  omniboxOpen: false,
  settingsOpen: false,
  historyOpen: false,
  findOpen: false,
  isMaximized: false,

  setBoot: (booted) => set({ booted }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar: (open) => set({ sidebarOpen: open }),
  toggleOmnibox: () => set((s) => ({ omniboxOpen: !s.omniboxOpen })),
  setOmnibox: (open) => set({ omniboxOpen: open }),
  toggleSettings: () => set((s) => ({ settingsOpen: !s.settingsOpen })),
  setSettings: (open) => set({ settingsOpen: open }),
  toggleHistory: () => set((s) => ({ historyOpen: !s.historyOpen })),
  setHistoryOpen: (open) => set({ historyOpen: open }),
  toggleFind: () => set((s) => ({ findOpen: !s.findOpen })),
  setFindOpen: (open) => set({ findOpen: open }),
  setMaximized: (maximized) => set({ isMaximized: maximized })
}))

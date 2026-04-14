import { create } from 'zustand'
import { soundTabOpen, soundTabClose, soundNavigate } from '@hooks/useSounds'

export interface TabState {
  id: number
  url: string
  title: string
  favicon: string
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
  loadProgress: number
  isAudioPlaying: boolean
  isMuted: boolean
  isCrashed: boolean
  isInternalPage: boolean
}

interface TabsStore {
  tabs: TabState[]
  activeTabId: number | null
  setTabs: (tabs: TabState[]) => void
  updateTab: (tab: TabState) => void
  setActiveTab: (id: number) => void
  addTab: (url?: string) => Promise<void>
  closeTab: (id: number) => void
  navigateTo: (url: string) => void
  goBack: () => void
  goForward: () => void
  reload: () => void
  hardReload: () => void
  stopLoading: () => void
  toggleMute: (id: number) => void
  reopenClosed: () => void
  duplicateTab: (id: number) => void
  closeOtherTabs: (keepId: number) => void
  closeTabsToRight: (afterId: number) => void
}

export const useTabsStore = create<TabsStore>((set, get) => ({
  tabs: [],
  activeTabId: null,

  setTabs: (tabs) => set({ tabs }),

  updateTab: (updatedTab) =>
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === updatedTab.id ? updatedTab : t))
    })),

  setActiveTab: (id) => {
    set({ activeTabId: id })
    window.portalOS.tabs.activate(id)
  },

  addTab: async (url?: string) => {
    const id = await window.portalOS.tabs.create(url)
    set({ activeTabId: id })
    soundTabOpen()
  },

  closeTab: (id) => {
    window.portalOS.tabs.close(id)
    soundTabClose()
  },

  navigateTo: (url) => {
    soundNavigate()
    const { activeTabId } = get()
    if (activeTabId !== null) {
      window.portalOS.tabs.navigate(activeTabId, url)
    }
  },

  goBack: () => {
    const { activeTabId } = get()
    if (activeTabId !== null) window.portalOS.tabs.goBack(activeTabId)
  },

  goForward: () => {
    const { activeTabId } = get()
    if (activeTabId !== null) window.portalOS.tabs.goForward(activeTabId)
  },

  reload: () => {
    const { activeTabId } = get()
    if (activeTabId !== null) window.portalOS.tabs.reload(activeTabId)
  },

  hardReload: () => {
    const { activeTabId } = get()
    if (activeTabId !== null) window.portalOS.tabs.hardReload(activeTabId)
  },

  stopLoading: () => {
    const { activeTabId } = get()
    if (activeTabId !== null) window.portalOS.tabs.stop(activeTabId)
  },

  toggleMute: (id) => window.portalOS.tabs.toggleMute(id),
  reopenClosed: () => window.portalOS.tabs.reopenClosed(),
  duplicateTab: (id) => window.portalOS.tabs.duplicate(id),
  closeOtherTabs: (keepId) => window.portalOS.tabs.closeOthers(keepId),
  closeTabsToRight: (afterId) => window.portalOS.tabs.closeToRight(afterId)
}))

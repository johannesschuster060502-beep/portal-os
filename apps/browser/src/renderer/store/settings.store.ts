import { create } from 'zustand'

interface SettingsStore {
  searchEngine: 'google' | 'duckduckgo' | 'brave' | 'bing' | 'kagi'
  accentColor: string
  tabStyle: 'compact' | 'default' | 'spacious'
  fontSize: number
  blockAds: boolean
  soundEnabled: boolean
  setSearchEngine: (engine: SettingsStore['searchEngine']) => void
  setAccentColor: (color: string) => void
  setTabStyle: (style: SettingsStore['tabStyle']) => void
  setFontSize: (size: number) => void
  setBlockAds: (block: boolean) => void
  setSoundEnabled: (enabled: boolean) => void
  loadFromDB: () => Promise<void>
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  searchEngine: 'google',
  accentColor: '#7c6af7',
  tabStyle: 'default',
  fontSize: 14,
  blockAds: true,
  soundEnabled: false,

  setSearchEngine: (engine) => {
    set({ searchEngine: engine })
    window.portalOS.db.setSetting('searchEngine', engine)
  },

  setAccentColor: (color) => {
    set({ accentColor: color })
    window.portalOS.db.setSetting('accentColor', color)
    document.documentElement.style.setProperty('--accent', color)
  },

  setTabStyle: (style) => {
    set({ tabStyle: style })
    window.portalOS.db.setSetting('tabStyle', style)
  },

  setFontSize: (size) => {
    set({ fontSize: size })
    window.portalOS.db.setSetting('fontSize', String(size))
  },

  setBlockAds: (block) => {
    set({ blockAds: block })
    window.portalOS.db.setSetting('blockAds', String(block))
  },

  setSoundEnabled: (enabled) => {
    set({ soundEnabled: enabled })
    window.portalOS.db.setSetting('soundEnabled', String(enabled))
  },

  loadFromDB: async () => {
    const settings = await window.portalOS.db.getAllSettings()
    set({
      searchEngine: (settings.searchEngine as SettingsStore['searchEngine']) || 'google',
      accentColor: settings.accentColor || '#7c6af7',
      tabStyle: (settings.tabStyle as SettingsStore['tabStyle']) || 'default',
      fontSize: settings.fontSize ? parseInt(settings.fontSize) : 14,
      blockAds: settings.blockAds !== 'false',
      soundEnabled: settings.soundEnabled === 'true'
    })
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--accent', settings.accentColor)
    }
  }
}))

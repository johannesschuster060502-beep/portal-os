import { create } from 'zustand'
import type { Locale } from '@lib/i18n'

type SearchEngine = 'google' | 'duckduckgo' | 'brave' | 'bing' | 'kagi'
type TabStyle = 'compact' | 'default' | 'spacious'
type StartupMode = 'newtab' | 'continue' | 'specific'
type CloseTabBehavior = 'left' | 'right' | 'lastActive'

interface SettingsStore {
  // General
  startupMode: StartupMode
  launchAtLogin: boolean
  hardwareAcceleration: boolean

  // Appearance
  accentColor: string
  fontSize: number
  reduceMotion: boolean

  // Tabs
  tabStyle: TabStyle
  tabGroupsEnabled: boolean
  closeTabBehavior: CloseTabBehavior

  // Privacy
  blockAds: boolean
  doNotTrack: boolean

  // Search
  searchEngine: SearchEngine

  // Downloads
  askWhereToSave: boolean
  downloadLocation: string

  // Language
  locale: Locale
  spellCheck: boolean

  // Sound
  soundEnabled: boolean

  // Setters
  setStartupMode: (m: StartupMode) => void
  setLaunchAtLogin: (v: boolean) => void
  setHardwareAcceleration: (v: boolean) => void

  setAccentColor: (color: string) => void
  setFontSize: (size: number) => void
  setReduceMotion: (v: boolean) => void

  setTabStyle: (style: TabStyle) => void
  setTabGroupsEnabled: (v: boolean) => void
  setCloseTabBehavior: (b: CloseTabBehavior) => void

  setBlockAds: (block: boolean) => void
  setDoNotTrack: (v: boolean) => void

  setSearchEngine: (engine: SearchEngine) => void

  setAskWhereToSave: (v: boolean) => void
  setDownloadLocation: (path: string) => void

  setLocale: (locale: Locale) => void
  setSpellCheck: (v: boolean) => void

  setSoundEnabled: (enabled: boolean) => void

  resetAll: () => void
  loadFromDB: () => Promise<void>
}

const defaults = {
  startupMode: 'newtab' as StartupMode,
  launchAtLogin: false,
  hardwareAcceleration: true,

  accentColor: '#7c6af7',
  fontSize: 14,
  reduceMotion: false,

  tabStyle: 'default' as TabStyle,
  tabGroupsEnabled: true,
  closeTabBehavior: 'right' as CloseTabBehavior,

  blockAds: true,
  doNotTrack: false,

  searchEngine: 'google' as SearchEngine,

  askWhereToSave: false,
  downloadLocation: '',

  locale: 'en' as Locale,
  spellCheck: true,

  soundEnabled: false
}

function persist(key: string, value: unknown): void {
  try {
    window.portalOS.db.setSetting(key, String(value))
  } catch {
    // Database may not be ready yet
  }
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...defaults,

  setStartupMode: (m) => {
    set({ startupMode: m })
    persist('startupMode', m)
  },
  setLaunchAtLogin: (v) => {
    set({ launchAtLogin: v })
    persist('launchAtLogin', v)
  },
  setHardwareAcceleration: (v) => {
    set({ hardwareAcceleration: v })
    persist('hardwareAcceleration', v)
  },

  setAccentColor: (color) => {
    set({ accentColor: color })
    persist('accentColor', color)
    document.documentElement.style.setProperty('--accent', color)
  },
  setFontSize: (size) => {
    set({ fontSize: size })
    persist('fontSize', size)
    document.documentElement.style.fontSize = `${size}px`
  },
  setReduceMotion: (v) => {
    set({ reduceMotion: v })
    persist('reduceMotion', v)
    document.documentElement.classList.toggle('reduce-motion', v)
  },

  setTabStyle: (style) => {
    set({ tabStyle: style })
    persist('tabStyle', style)
  },
  setTabGroupsEnabled: (v) => {
    set({ tabGroupsEnabled: v })
    persist('tabGroupsEnabled', v)
  },
  setCloseTabBehavior: (b) => {
    set({ closeTabBehavior: b })
    persist('closeTabBehavior', b)
  },

  setBlockAds: (block) => {
    set({ blockAds: block })
    persist('blockAds', block)
  },
  setDoNotTrack: (v) => {
    set({ doNotTrack: v })
    persist('doNotTrack', v)
  },

  setSearchEngine: (engine) => {
    set({ searchEngine: engine })
    persist('searchEngine', engine)
  },

  setAskWhereToSave: (v) => {
    set({ askWhereToSave: v })
    persist('askWhereToSave', v)
  },
  setDownloadLocation: (path) => {
    set({ downloadLocation: path })
    persist('downloadLocation', path)
  },

  setLocale: (locale) => {
    set({ locale })
    persist('locale', locale)
  },
  setSpellCheck: (v) => {
    set({ spellCheck: v })
    persist('spellCheck', v)
  },

  setSoundEnabled: (enabled) => {
    set({ soundEnabled: enabled })
    persist('soundEnabled', enabled)
  },

  resetAll: () => {
    set({ ...defaults })
    for (const [key, value] of Object.entries(defaults)) {
      persist(key, value)
    }
    document.documentElement.style.setProperty('--accent', defaults.accentColor)
    document.documentElement.style.fontSize = `${defaults.fontSize}px`
    document.documentElement.classList.remove('reduce-motion')
  },

  loadFromDB: async () => {
    try {
      const s = await window.portalOS.db.getAllSettings()
      const parsed: Partial<SettingsStore> = {}

      if (s.startupMode) parsed.startupMode = s.startupMode as StartupMode
      if (s.launchAtLogin) parsed.launchAtLogin = s.launchAtLogin === 'true'
      if (s.hardwareAcceleration) parsed.hardwareAcceleration = s.hardwareAcceleration !== 'false'

      if (s.accentColor) parsed.accentColor = s.accentColor
      if (s.fontSize) parsed.fontSize = parseInt(s.fontSize, 10) || 14
      if (s.reduceMotion) parsed.reduceMotion = s.reduceMotion === 'true'

      if (s.tabStyle) parsed.tabStyle = s.tabStyle as TabStyle
      if (s.tabGroupsEnabled) parsed.tabGroupsEnabled = s.tabGroupsEnabled !== 'false'
      if (s.closeTabBehavior) parsed.closeTabBehavior = s.closeTabBehavior as CloseTabBehavior

      if (s.blockAds) parsed.blockAds = s.blockAds !== 'false'
      if (s.doNotTrack) parsed.doNotTrack = s.doNotTrack === 'true'

      if (s.searchEngine) parsed.searchEngine = s.searchEngine as SearchEngine

      if (s.askWhereToSave) parsed.askWhereToSave = s.askWhereToSave === 'true'
      if (s.downloadLocation) parsed.downloadLocation = s.downloadLocation

      if (s.locale === 'en' || s.locale === 'de') parsed.locale = s.locale

      if (s.spellCheck) parsed.spellCheck = s.spellCheck !== 'false'

      if (s.soundEnabled) parsed.soundEnabled = s.soundEnabled === 'true'

      set(parsed)

      // Apply to DOM
      if (parsed.accentColor) {
        document.documentElement.style.setProperty('--accent', parsed.accentColor)
      }
      if (parsed.fontSize) {
        document.documentElement.style.fontSize = `${parsed.fontSize}px`
      }
      if (parsed.reduceMotion) {
        document.documentElement.classList.add('reduce-motion')
      }
    } catch {
      // First run — use defaults
    }
  }
}))

import { create } from 'zustand'
import { type Locale, type Translations, detectLocale, getTranslations } from '@lib/i18n'

interface I18nStore {
  locale: Locale
  t: Translations
  setLocale: (locale: Locale) => void
  loadFromDB: () => Promise<void>
}

const initialLocale = detectLocale()

export const useI18nStore = create<I18nStore>((set) => ({
  locale: initialLocale,
  t: getTranslations(initialLocale),

  setLocale: (locale) => {
    set({ locale, t: getTranslations(locale) })
    window.portalOS.db.setSetting('locale', locale)
    try {
      localStorage.setItem('portalos-locale', locale)
    } catch {
      // Ignore quota errors
    }
    document.documentElement.lang = locale
  },

  loadFromDB: async () => {
    try {
      const stored = await window.portalOS.db.getSetting('locale')
      if (stored === 'en' || stored === 'de') {
        set({ locale: stored, t: getTranslations(stored) })
        try {
          localStorage.setItem('portalos-locale', stored)
        } catch {
          // Ignore
        }
        document.documentElement.lang = stored
      }
    } catch {
      // Fall back to detected locale
    }
  }
}))

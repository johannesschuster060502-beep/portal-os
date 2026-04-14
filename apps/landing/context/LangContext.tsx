'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { getTranslations, type Locale, type Translations } from '@/lib/i18n'

interface LangContextValue {
  lang: Locale
  t: Translations
  setLang: (l: Locale) => void
}

const LangContext = createContext<LangContextValue>({
  lang: 'de',
  t: getTranslations('de'),
  setLang: () => {}
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Locale>('de')

  // On mount: restore saved language preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('portalos-lang') as Locale | null
      if (saved === 'en' || saved === 'de') {
        setLangState(saved)
        document.documentElement.lang = saved
      }
    } catch {
      // localStorage unavailable (SSR guard)
    }
  }, [])

  function setLang(l: Locale) {
    setLangState(l)
    try {
      localStorage.setItem('portalos-lang', l)
    } catch {}
    document.documentElement.lang = l
  }

  return (
    <LangContext.Provider value={{ lang, t: getTranslations(lang), setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang(): LangContextValue {
  return useContext(LangContext)
}

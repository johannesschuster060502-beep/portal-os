/**
 * Portal OS — Internationalization
 *
 * Complete DE/EN translation system.
 * Language is detected from system locale, can be overridden in Settings,
 * and persisted to SQLite.
 */

export type Locale = 'en' | 'de'

export const locales: { code: Locale; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'de', label: 'German', native: 'Deutsch' }
]

// ══════════════════════════════════════════════════════════════
//  TRANSLATION KEYS
// ══════════════════════════════════════════════════════════════

export interface Translations {
  // Boot screen
  boot: {
    initializing: string
    loadingExtensions: string
    mountingSecureContext: string
    ready: string
  }

  // NewTab page
  newtab: {
    greetingMorning: string
    greetingAfternoon: string
    greetingEvening: string
    greetingNight: string
    searchPlaceholder: string
    newTab: string
  }

  // Quick links
  quickLinks: {
    studoxCore: string
  }

  // Shell
  shell: {
    back: string
    forward: string
    reload: string
    stop: string
    newTab: string
    closeTab: string
    minimize: string
    maximize: string
    restore: string
    close: string
  }

  // Address bar
  address: {
    placeholder: string
    stopLoading: string
    addBookmark: string
    removeBookmark: string
    resetZoom: string
  }

  // Tab context menu
  tabMenu: {
    reload: string
    duplicate: string
    mute: string
    unmute: string
    close: string
    closeOthers: string
    closeToRight: string
    addToNewGroup: string
    addToGroup: string
    removeFromGroup: string
    pin: string
    unpin: string
  }

  // Omnibox
  omnibox: {
    placeholder: string
    noResults: string
    searchWeb: string
    openTabs: string
    history: string
    bookmarks: string
    actions: string
    actionNewTab: string
    actionSettings: string
    actionBookmarks: string
    actionStudoxCore: string
  }

  // Settings
  settings: {
    title: string
    searchPlaceholder: string
    sections: {
      general: string
      appearance: string
      tabs: string
      privacy: string
      search: string
      downloads: string
      language: string
      shortcuts: string
      system: string
      about: string
    }

    // General
    startupTitle: string
    startupNewTab: string
    startupContinue: string
    startupSpecific: string
    openAtLogin: string
    openAtLoginDesc: string
    hardwareAcceleration: string
    hardwareAccelerationDesc: string

    // Appearance
    themeTitle: string
    themeDescription: string
    accentColorTitle: string
    accentColorDesc: string
    fontSizeTitle: string
    fontSizeDesc: string
    reduceMotionTitle: string
    reduceMotionDesc: string

    // Tabs
    tabStyleTitle: string
    tabStyleCompact: string
    tabStyleDefault: string
    tabStyleSpacious: string
    tabGroupsTitle: string
    tabGroupsDesc: string
    closeTabBehaviorTitle: string
    closeTabBehaviorLeft: string
    closeTabBehaviorRight: string
    closeTabBehaviorLastActive: string

    // Privacy
    blockAdsTitle: string
    blockAdsDesc: string
    doNotTrackTitle: string
    doNotTrackDesc: string
    clearHistoryTitle: string
    clearHistoryDesc: string
    clearHistoryButton: string
    clearCookiesTitle: string
    clearCookiesDesc: string
    clearCookiesButton: string
    clearCacheTitle: string
    clearCacheDesc: string
    clearCacheButton: string

    // Search
    defaultSearchEngine: string
    searchEngineDesc: string

    // Downloads
    downloadLocation: string
    downloadLocationDesc: string
    askWhereToSave: string
    askWhereToSaveDesc: string

    // Language
    languageTitle: string
    languageDesc: string
    spellCheckTitle: string
    spellCheckDesc: string

    // Shortcuts
    shortcutsTitle: string
    shortcutsDesc: string

    // About
    aboutVersion: string
    aboutBuildInfo: string
    aboutCheckUpdates: string
    aboutCheckingUpdates: string
    aboutUpToDate: string
    aboutUpdateReady: string
    aboutBuiltBy: string
    aboutOpenSource: string

    // System
    resetAll: string
    resetAllDesc: string
    resetAllButton: string
    resetAllConfirm: string
  }

  // History panel
  history: {
    title: string
    searchPlaceholder: string
    clearAll: string
    today: string
    yesterday: string
    thisWeek: string
    older: string
    noHistory: string
    noResults: string
  }

  // Sidebar
  sidebar: {
    bookmarks: string
    history: string
    downloads: string
    noBookmarks: string
    noBookmarksHint: string
    noHistory: string
    noHistoryHint: string
  }

  // Updater
  updater: {
    downloading: string
    ready: string
    installAndRestart: string
    upToDate: string
    checking: string
  }

  // STUDOX
  studox: {
    coreButtonLabel: string
    coreLoading: string
    coreSubtitle: string
    poweredBy: string
    initializingCore: string
  }

  // Common
  common: {
    cancel: string
    save: string
    delete: string
    confirm: string
    close: string
    add: string
    remove: string
    edit: string
    enabled: string
    disabled: string
    on: string
    off: string
    version: string
  }
}

// ══════════════════════════════════════════════════════════════
//  ENGLISH
// ══════════════════════════════════════════════════════════════

const en: Translations = {
  boot: {
    initializing: 'initializing chromium engine... ok',
    loadingExtensions: 'loading extensions... ok',
    mountingSecureContext: 'mounting secure context... ok',
    ready: 'ready.'
  },
  newtab: {
    greetingMorning: 'GOOD MORNING',
    greetingAfternoon: 'GOOD AFTERNOON',
    greetingEvening: 'GOOD EVENING',
    greetingNight: 'GOOD NIGHT',
    searchPlaceholder: 'Search the web or enter URL',
    newTab: 'New Tab'
  },
  quickLinks: {
    studoxCore: 'STUDOX'
  },
  shell: {
    back: 'Go back',
    forward: 'Go forward',
    reload: 'Reload',
    stop: 'Stop loading',
    newTab: 'New tab',
    closeTab: 'Close tab',
    minimize: 'Minimize',
    maximize: 'Maximize',
    restore: 'Restore',
    close: 'Close'
  },
  address: {
    placeholder: 'Search or enter URL',
    stopLoading: 'Stop loading',
    addBookmark: 'Add bookmark',
    removeBookmark: 'Remove bookmark',
    resetZoom: 'Reset zoom'
  },
  tabMenu: {
    reload: 'Reload',
    duplicate: 'Duplicate tab',
    mute: 'Mute tab',
    unmute: 'Unmute tab',
    close: 'Close tab',
    closeOthers: 'Close other tabs',
    closeToRight: 'Close tabs to the right',
    addToNewGroup: 'Add to new group',
    addToGroup: 'Add to group',
    removeFromGroup: 'Remove from group',
    pin: 'Pin tab',
    unpin: 'Unpin tab'
  },
  omnibox: {
    placeholder: 'Search tabs, history, bookmarks, or type a URL...',
    noResults: 'No results — press Enter to search the web',
    searchWeb: 'Search the web',
    openTabs: 'OPEN TABS',
    history: 'HISTORY',
    bookmarks: 'BOOKMARKS',
    actions: 'ACTIONS',
    actionNewTab: 'New Tab',
    actionSettings: 'Settings',
    actionBookmarks: 'Bookmarks',
    actionStudoxCore: 'Open StudoX Core'
  },
  settings: {
    title: 'Settings',
    searchPlaceholder: 'Search settings...',
    sections: {
      general: 'General',
      appearance: 'Appearance',
      tabs: 'Tabs',
      privacy: 'Privacy & Security',
      search: 'Search Engine',
      downloads: 'Downloads',
      language: 'Languages',
      shortcuts: 'Keyboard Shortcuts',
      system: 'System',
      about: 'About Portal OS'
    },
    startupTitle: 'On startup',
    startupNewTab: 'Open the New Tab page',
    startupContinue: 'Continue where you left off',
    startupSpecific: 'Open a specific page or set of pages',
    openAtLogin: 'Launch Portal OS at system startup',
    openAtLoginDesc: 'Automatically start when you log into your computer',
    hardwareAcceleration: 'Use hardware acceleration when available',
    hardwareAccelerationDesc: 'Improves rendering performance for GPU-accelerated sites',

    themeTitle: 'Theme',
    themeDescription: 'Portal OS is dark-native — every element is designed for dark mode',
    accentColorTitle: 'Accent color',
    accentColorDesc: 'Used for highlights, focus rings, and active states',
    fontSizeTitle: 'Font size',
    fontSizeDesc: 'Adjust the base UI font size',
    reduceMotionTitle: 'Reduce motion',
    reduceMotionDesc: 'Disable spring animations and parallax effects',

    tabStyleTitle: 'Tab style',
    tabStyleCompact: 'Compact',
    tabStyleDefault: 'Default',
    tabStyleSpacious: 'Spacious',
    tabGroupsTitle: 'Enable tab groups',
    tabGroupsDesc: 'Group tabs by color and label, collapse and expand like Opera GX',
    closeTabBehaviorTitle: 'When closing a tab, switch to',
    closeTabBehaviorLeft: 'Tab to the left',
    closeTabBehaviorRight: 'Tab to the right',
    closeTabBehaviorLastActive: 'Last active tab',

    blockAdsTitle: 'Block ads and trackers',
    blockAdsDesc: 'Uses the built-in content blocker with EasyList + EasyPrivacy',
    doNotTrackTitle: 'Send Do Not Track request',
    doNotTrackDesc: 'Ask sites to not track you (not all sites respect this)',
    clearHistoryTitle: 'Browsing history',
    clearHistoryDesc: 'Delete all history entries from the local database',
    clearHistoryButton: 'Clear browsing history',
    clearCookiesTitle: 'Cookies and site data',
    clearCookiesDesc: 'Sign you out of most sites',
    clearCookiesButton: 'Clear cookies',
    clearCacheTitle: 'Cached files',
    clearCacheDesc: 'Free up disk space — pages will load slower the next time',
    clearCacheButton: 'Clear cache',

    defaultSearchEngine: 'Default search engine',
    searchEngineDesc: 'Used in the address bar when you enter a search query',

    downloadLocation: 'Download location',
    downloadLocationDesc: 'Where files will be saved',
    askWhereToSave: 'Ask where to save each file before downloading',
    askWhereToSaveDesc: 'Show a Save As dialog for every download',

    languageTitle: 'Display language',
    languageDesc: 'Changes the language of all Portal OS UI',
    spellCheckTitle: 'Spell check',
    spellCheckDesc: 'Enable spell checking in text fields',

    shortcutsTitle: 'Keyboard shortcuts',
    shortcutsDesc: 'Customize or view all Portal OS keyboard shortcuts',

    aboutVersion: 'Version',
    aboutBuildInfo: 'Build information',
    aboutCheckUpdates: 'Check for updates',
    aboutCheckingUpdates: 'Checking...',
    aboutUpToDate: 'You are on the latest version.',
    aboutUpdateReady: 'Update ready — restart to install',
    aboutBuiltBy: 'Built by',
    aboutOpenSource: 'Powered by Chromium. Open-source components licensed under MIT, BSD, and Apache 2.0.',

    resetAll: 'Reset all settings',
    resetAllDesc: 'Restore all Portal OS settings to their defaults. This cannot be undone.',
    resetAllButton: 'Reset to defaults',
    resetAllConfirm: 'Are you sure? This will reset all settings.'
  },
  history: {
    title: 'History',
    searchPlaceholder: 'Search history...',
    clearAll: 'Clear all',
    today: 'TODAY',
    yesterday: 'YESTERDAY',
    thisWeek: 'THIS WEEK',
    older: 'OLDER',
    noHistory: 'No history yet',
    noResults: 'No results found'
  },
  sidebar: {
    bookmarks: 'Bookmarks',
    history: 'History',
    downloads: 'Downloads',
    noBookmarks: 'No bookmarks yet',
    noBookmarksHint: 'Press Ctrl+D to bookmark a page',
    noHistory: 'No history yet',
    noHistoryHint: 'Start browsing to build history'
  },
  updater: {
    downloading: 'Downloading Portal OS',
    ready: 'is ready to install.',
    installAndRestart: 'Install & Restart',
    upToDate: 'You are on the latest version.',
    checking: 'Checking for updates...'
  },
  studox: {
    coreButtonLabel: 'Open StudoX Core',
    coreLoading: 'INITIALIZING STUDOX CORE',
    coreSubtitle: 'Establishing secure connection',
    poweredBy: 'POWERED BY STUDOX',
    initializingCore: 'ACCESSING CORE INTERFACE'
  },
  common: {
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    confirm: 'Confirm',
    close: 'Close',
    add: 'Add',
    remove: 'Remove',
    edit: 'Edit',
    enabled: 'Enabled',
    disabled: 'Disabled',
    on: 'On',
    off: 'Off',
    version: 'Version'
  }
}

// ══════════════════════════════════════════════════════════════
//  GERMAN
// ══════════════════════════════════════════════════════════════

const de: Translations = {
  boot: {
    initializing: 'initialisiere chromium engine... ok',
    loadingExtensions: 'lade erweiterungen... ok',
    mountingSecureContext: 'sicherer kontext aktiviert... ok',
    ready: 'bereit.'
  },
  newtab: {
    greetingMorning: 'GUTEN MORGEN',
    greetingAfternoon: 'GUTEN TAG',
    greetingEvening: 'GUTEN ABEND',
    greetingNight: 'GUTE NACHT',
    searchPlaceholder: 'Im Web suchen oder URL eingeben',
    newTab: 'Neuer Tab'
  },
  quickLinks: {
    studoxCore: 'STUDOX'
  },
  shell: {
    back: 'Zurück',
    forward: 'Vorwärts',
    reload: 'Neu laden',
    stop: 'Laden stoppen',
    newTab: 'Neuer Tab',
    closeTab: 'Tab schließen',
    minimize: 'Minimieren',
    maximize: 'Maximieren',
    restore: 'Wiederherstellen',
    close: 'Schließen'
  },
  address: {
    placeholder: 'Suchen oder URL eingeben',
    stopLoading: 'Laden stoppen',
    addBookmark: 'Lesezeichen hinzufügen',
    removeBookmark: 'Lesezeichen entfernen',
    resetZoom: 'Zoom zurücksetzen'
  },
  tabMenu: {
    reload: 'Neu laden',
    duplicate: 'Tab duplizieren',
    mute: 'Tab stummschalten',
    unmute: 'Stummschaltung aufheben',
    close: 'Tab schließen',
    closeOthers: 'Andere Tabs schließen',
    closeToRight: 'Tabs rechts schließen',
    addToNewGroup: 'Zu neuer Gruppe hinzufügen',
    addToGroup: 'Zu Gruppe hinzufügen',
    removeFromGroup: 'Aus Gruppe entfernen',
    pin: 'Tab anheften',
    unpin: 'Tab lösen'
  },
  omnibox: {
    placeholder: 'Tabs, Verlauf, Lesezeichen durchsuchen oder URL eingeben...',
    noResults: 'Keine Ergebnisse — Enter drücken um im Web zu suchen',
    searchWeb: 'Im Web suchen',
    openTabs: 'OFFENE TABS',
    history: 'VERLAUF',
    bookmarks: 'LESEZEICHEN',
    actions: 'AKTIONEN',
    actionNewTab: 'Neuer Tab',
    actionSettings: 'Einstellungen',
    actionBookmarks: 'Lesezeichen',
    actionStudoxCore: 'StudoX Core öffnen'
  },
  settings: {
    title: 'Einstellungen',
    searchPlaceholder: 'Einstellungen durchsuchen...',
    sections: {
      general: 'Allgemein',
      appearance: 'Darstellung',
      tabs: 'Tabs',
      privacy: 'Datenschutz & Sicherheit',
      search: 'Suchmaschine',
      downloads: 'Downloads',
      language: 'Sprachen',
      shortcuts: 'Tastenkürzel',
      system: 'System',
      about: 'Über Portal OS'
    },
    startupTitle: 'Beim Start',
    startupNewTab: 'Neuen Tab öffnen',
    startupContinue: 'Dort fortfahren wo du aufgehört hast',
    startupSpecific: 'Bestimmte Seite oder Seiten öffnen',
    openAtLogin: 'Portal OS beim Systemstart starten',
    openAtLoginDesc: 'Automatisch starten sobald du dich am Computer anmeldest',
    hardwareAcceleration: 'Hardwarebeschleunigung verwenden wenn verfügbar',
    hardwareAccelerationDesc: 'Verbessert die Darstellungsleistung für GPU-beschleunigte Seiten',

    themeTitle: 'Theme',
    themeDescription: 'Portal OS ist dark-native — jedes Element ist für den Dark Mode gestaltet',
    accentColorTitle: 'Akzentfarbe',
    accentColorDesc: 'Wird für Highlights, Fokusränder und aktive Zustände verwendet',
    fontSizeTitle: 'Schriftgröße',
    fontSizeDesc: 'Basis-Schriftgröße der Oberfläche anpassen',
    reduceMotionTitle: 'Bewegung reduzieren',
    reduceMotionDesc: 'Spring-Animationen und Parallax-Effekte deaktivieren',

    tabStyleTitle: 'Tab-Stil',
    tabStyleCompact: 'Kompakt',
    tabStyleDefault: 'Standard',
    tabStyleSpacious: 'Geräumig',
    tabGroupsTitle: 'Tab-Gruppen aktivieren',
    tabGroupsDesc: 'Tabs nach Farbe und Label gruppieren, einklappen und erweitern wie in Opera GX',
    closeTabBehaviorTitle: 'Beim Schließen eines Tabs wechseln zu',
    closeTabBehaviorLeft: 'Tab links',
    closeTabBehaviorRight: 'Tab rechts',
    closeTabBehaviorLastActive: 'Letztem aktivem Tab',

    blockAdsTitle: 'Werbung und Tracker blockieren',
    blockAdsDesc: 'Verwendet den eingebauten Content-Blocker mit EasyList + EasyPrivacy',
    doNotTrackTitle: 'Do Not Track Anfrage senden',
    doNotTrackDesc: 'Websites bitten dich nicht zu tracken (nicht alle Seiten respektieren das)',
    clearHistoryTitle: 'Browserverlauf',
    clearHistoryDesc: 'Alle Verlaufseinträge aus der lokalen Datenbank löschen',
    clearHistoryButton: 'Verlauf löschen',
    clearCookiesTitle: 'Cookies und Seitendaten',
    clearCookiesDesc: 'Meldet dich von den meisten Seiten ab',
    clearCookiesButton: 'Cookies löschen',
    clearCacheTitle: 'Zwischengespeicherte Dateien',
    clearCacheDesc: 'Speicherplatz freigeben — Seiten laden beim nächsten Mal langsamer',
    clearCacheButton: 'Cache löschen',

    defaultSearchEngine: 'Standard-Suchmaschine',
    searchEngineDesc: 'Wird in der Adressleiste verwendet wenn du eine Suchanfrage eingibst',

    downloadLocation: 'Download-Ort',
    downloadLocationDesc: 'Wo Dateien gespeichert werden',
    askWhereToSave: 'Vor jedem Download fragen wo gespeichert werden soll',
    askWhereToSaveDesc: 'Speichern-unter-Dialog für jeden Download anzeigen',

    languageTitle: 'Anzeigesprache',
    languageDesc: 'Ändert die Sprache der gesamten Portal OS Oberfläche',
    spellCheckTitle: 'Rechtschreibprüfung',
    spellCheckDesc: 'Rechtschreibprüfung in Textfeldern aktivieren',

    shortcutsTitle: 'Tastenkürzel',
    shortcutsDesc: 'Alle Portal OS Tastenkürzel anpassen oder anzeigen',

    aboutVersion: 'Version',
    aboutBuildInfo: 'Build-Informationen',
    aboutCheckUpdates: 'Nach Updates suchen',
    aboutCheckingUpdates: 'Suche...',
    aboutUpToDate: 'Du verwendest die aktuellste Version.',
    aboutUpdateReady: 'Update bereit — neustarten zum Installieren',
    aboutBuiltBy: 'Entwickelt von',
    aboutOpenSource: 'Basiert auf Chromium. Open-Source-Komponenten lizenziert unter MIT, BSD und Apache 2.0.',

    resetAll: 'Alle Einstellungen zurücksetzen',
    resetAllDesc: 'Alle Portal OS Einstellungen auf Standard zurücksetzen. Dies kann nicht rückgängig gemacht werden.',
    resetAllButton: 'Auf Standard zurücksetzen',
    resetAllConfirm: 'Bist du sicher? Dies setzt alle Einstellungen zurück.'
  },
  history: {
    title: 'Verlauf',
    searchPlaceholder: 'Verlauf durchsuchen...',
    clearAll: 'Alle löschen',
    today: 'HEUTE',
    yesterday: 'GESTERN',
    thisWeek: 'DIESE WOCHE',
    older: 'ÄLTER',
    noHistory: 'Noch kein Verlauf',
    noResults: 'Keine Ergebnisse gefunden'
  },
  sidebar: {
    bookmarks: 'Lesezeichen',
    history: 'Verlauf',
    downloads: 'Downloads',
    noBookmarks: 'Noch keine Lesezeichen',
    noBookmarksHint: 'Drücke Strg+D um eine Seite zu speichern',
    noHistory: 'Noch kein Verlauf',
    noHistoryHint: 'Fang an zu surfen um Verlauf aufzubauen'
  },
  updater: {
    downloading: 'Lade Portal OS',
    ready: 'ist bereit zur Installation.',
    installAndRestart: 'Installieren & neustarten',
    upToDate: 'Du verwendest die aktuellste Version.',
    checking: 'Suche nach Updates...'
  },
  studox: {
    coreButtonLabel: 'StudoX Core öffnen',
    coreLoading: 'STUDOX CORE WIRD INITIALISIERT',
    coreSubtitle: 'Sichere Verbindung wird aufgebaut',
    poweredBy: 'POWERED BY STUDOX',
    initializingCore: 'ZUGRIFF AUF CORE INTERFACE'
  },
  common: {
    cancel: 'Abbrechen',
    save: 'Speichern',
    delete: 'Löschen',
    confirm: 'Bestätigen',
    close: 'Schließen',
    add: 'Hinzufügen',
    remove: 'Entfernen',
    edit: 'Bearbeiten',
    enabled: 'Aktiviert',
    disabled: 'Deaktiviert',
    on: 'An',
    off: 'Aus',
    version: 'Version'
  }
}

const translations: Record<Locale, Translations> = { en, de }

// ══════════════════════════════════════════════════════════════
//  LOCALE DETECTION
// ══════════════════════════════════════════════════════════════

export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en'
  const lang = navigator.language.toLowerCase()
  if (lang.startsWith('de')) return 'de'
  return 'en'
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.en
}

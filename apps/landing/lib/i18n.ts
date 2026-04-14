export type Locale = 'de' | 'en'

export interface FeatureItem {
  tag: string
  title: string
  description: string
  glyph: string
}

export interface PrincipleItem {
  glyph: string
  title: string
  desc: string
}

export interface PlatformItem {
  id: 'windows' | 'macos' | 'linux'
  name: string
  icon: string
  file: string
  note: string
  format: string
}

export interface ReleaseItem {
  version: string
  date: string
  tag: string
  items: string[]
}

export interface Translations {
  nav: {
    features: string
    download: string
    changelog: string
  }
  home: {
    eyebrow: string
    subtitle: string
    downloadBtn: string
    githubBtn: string
    platforms: string
    scroll: string
    featuresLabel: string
    featuresTitle1: string
    featuresTitle2: string
    featuresSubtitle: string
    philosophyLabel: string
    philosophyTitle: string
    philosophyDesc: string
    principles: PrincipleItem[]
    techLabel: string
    techTitle: string
    techDesc: string
    ctaTitle1: string
    ctaTitle2: string
    ctaDesc: string
    ctaBtn: string
    features: FeatureItem[]
  }
  footer: {
    download: string
    changelog: string
    builtBy: string
    tagline: string
  }
  download: {
    eyebrow: string
    title: string
    versionLabel: string
    detected: string
    downloadBtn: string
    releaseInfo: string
    viewAll: string
    portalOSDetected: string
    portalOSDetectedDesc: string
    portalOSUpdatesHint: string
  }
  changelog: {
    eyebrow: string
    title: string
    releases: ReleaseItem[]
  }
}

// ─────────────────────────────────────────────
//  SHARED CONSTANTS
// ─────────────────────────────────────────────

const VERSION = process.env.NEXT_PUBLIC_VERSION || '1.0.3'
const BASE =
  process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL ||
  'https://github.com/johannesschuster060502-beep/portal-os-releases/releases/latest/download'

// ─────────────────────────────────────────────
//  DEUTSCH (Standard)
// ─────────────────────────────────────────────

const de: Translations = {
  nav: {
    features: 'Features',
    download: 'Download',
    changelog: 'Changelog'
  },

  home: {
    eyebrow: `v${VERSION} — PORTAL OS · STUDOX`,

    subtitle:
      'Der einzige Browser, der nicht um\ndeine Aufmerksamkeit kämpft.\nNatives Dark-Design. Kein Rauschen.',

    downloadBtn: 'Für Windows herunterladen',
    githubBtn: 'GitHub →',
    platforms: 'WINDOWS · MACOS · LINUX',
    scroll: 'WEITER',

    // ── Features section ──
    featuresLabel: 'WARUM PORTAL OS',
    featuresTitle1: 'Andere Browser wurden',
    featuresTitle2: 'für Ablenkung gebaut.',
    featuresSubtitle:
      'Portal OS nicht. Jede Designentscheidung, jede Farbe, jede Interaktion wurde mit einem einzigen Ziel getroffen: deinen Fokus zu schützen — nicht zu stehlen.',

    // ── Philosophy section ──
    philosophyLabel: 'DESIGNPHILOSOPHIE',
    philosophyTitle: 'Weiß ist Lärm.\nDunkel ist Fokus.',
    philosophyDesc:
      'Dein visuelles System reagiert auf Helligkeit. Helle Oberflächen aktivieren Wachheit und kognitive Reizverarbeitung — das genaue Gegenteil von tiefer Konzentration. Portal OS ist dark-native: nicht als Designtrend, sondern als fundierte Entscheidung für deinen mentalen Raum. Jedes Pixel wurde für Dunkelheit entworfen. Kein Nachgedanke. Kein Toggle.',

    principles: [
      {
        glyph: '◼',
        title: 'Dark by Design',
        desc: 'Kein Dark-Mode-Schalter. Kein Light-Mode-Option. Portal OS existiert nur in Dunkelheit — jeder Kontrast, jede Schriftfarbe, jedes Bedienelement wurde von Anfang an für dunkle Bildschirme designt. Das Ergebnis ist ein Interface das nach Stunden nicht mehr brennt.'
      },
      {
        glyph: '◻',
        title: 'Stille als Standard',
        desc: 'Was nicht da ist, kann nicht ablenken. Kein Nachrichten-Feed beim Start, keine gesponserten Empfehlungen, keine Notification-Wände, kein Algorithmus der entscheidet was du als nächstes sehen sollst. Dein Startpunkt ist Stille — nicht jemand anderes Content.'
      },
      {
        glyph: '◈',
        title: 'Werkzeug, nicht Plattform',
        desc: 'Ein Browser sollte das Web öffnen — nicht selbst Inhalt werden. Portal OS tritt zurück. Die Oberfläche ist bewusst reduziert damit deine Arbeit, dein Lernstoff, dein Gedanke sichtbar werden kann — ohne zu konkurrieren.'
      }
    ],

    // ── Tech stack ──
    techLabel: 'TECH STACK',
    techTitle: 'Solide gebaut.',
    techDesc:
      'Keine Experimente, keine proprietären Abhängigkeiten. Portal OS baut auf bewährten Open-Source-Technologien auf die du kennst — und fügt die Schicht hinzu die sie fokussiert macht.',

    // ── CTA ──
    ctaTitle1: 'Weniger',
    ctaTitle2: 'Rauschen.',
    ctaDesc:
      'Portal OS ist kostenlos, Open-Source und für alle Menschen gebaut die verstehen: echter Fokus beginnt nicht mit einer App-Funktion — er beginnt mit der richtigen Umgebung.',
    ctaBtn: 'Jetzt Portal OS herunterladen',

    // ── 6 Features ──
    features: [
      {
        tag: 'FOKUS',
        glyph: '◈',
        title: 'Stiller Startpunkt',
        description:
          'Kein Nachrichten-Feed, keine gesponserten Empfehlungen, kein Thumbnail-Raster das nach deiner Aufmerksamkeit greift. Wenn du einen neuen Tab öffnest, siehst du: dich. Eine Suchleiste. Stille. Nichts das dich ablenkt bevor du angefangen hast zu denken.'
      },
      {
        tag: 'NAVIGATION',
        glyph: '⬡',
        title: 'Befehlspalette (Strg+K)',
        description:
          'Navigiere Tabs, Verlauf, Lesezeichen und Schnellaktionen ohne Maus, ohne Menühierarchie, ohne deinen Flow zu unterbrechen. Die Palette erscheint wenn du sie brauchst und verschwindet wenn du fertig bist. Sichtbar wenn nötig — unsichtbar wenn nicht.'
      },
      {
        tag: 'ENGINE',
        glyph: '◉',
        title: 'Volle Chromium-Engine',
        description:
          'Dieselbe Rendering-Engine wie Chrome. Jede Website, jede Web-App, alle modernen Standards — ohne Kompromisse. Portal OS gibt dir Fokus ohne Kompatibilität zu opfern. Deine Tools funktionieren. Dein Workflow bleibt ungebrochen.'
      },
      {
        tag: 'PRIVAT',
        glyph: '⬢',
        title: 'Kein Account. Keine Cloud. Kein Tracking.',
        description:
          'Deine Browserdaten bleiben auf deinem Gerät. Keine Anmeldung, keine Synchronisierung zu fremden Servern, kein Telemetrie das nach Hause telefoniert. Der eingebaute Werbeblocker entfernt außerdem einen der hartnäckigsten Aufmerksamkeitsräuber im Web.'
      },
      {
        tag: 'DARK',
        glyph: '✦',
        title: 'Dark-Native by Design',
        description:
          'Portal OS hat keinen "Dark Mode" — es ist dark. Von der Tab-Leiste bis zum letzten Kontextmenü wurde jedes Element für dunkle Bildschirme designed, nicht als nachträgliche Option hinzugefügt. Deine Augen werden den Unterschied nach vier Stunden Arbeit bemerken.'
      },
      {
        tag: 'ZUVERLÄSSIG',
        glyph: '◆',
        title: 'Updates die nicht stören',
        description:
          'Neue Versionen laden im Hintergrund via GitHub Releases. Du entscheidest wann installiert wird — kein erzwungener Neustart, kein Pop-up das deinen Flow zerreißt. Was sich geändert hat siehst du direkt im Browser als Changelog vor dem Update.'
      }
    ]
  },

  footer: {
    download: 'Download',
    changelog: 'Changelog',
    builtBy: 'ENTWICKELT VON JOHANNESAFK · STUDOX',
    tagline: 'FOKUS IST EINE UMGEBUNG'
  },

  download: {
    eyebrow: 'DOWNLOAD',
    title: 'Portal OS herunterladen',
    versionLabel: `Version ${VERSION} — Kostenlos und Open-Source`,
    detected: 'ERKANNT',
    downloadBtn: 'Herunterladen',
    releaseInfo:
      'Alle Releases werden automatisch via GitHub Actions gebaut und auf GitHub Releases veröffentlicht.',
    viewAll: 'Alle Releases auf GitHub ansehen →',
    portalOSDetected: 'Du verwendest bereits Portal OS',
    portalOSDetectedDesc:
      'Du surfst gerade mit Portal OS. Updates erscheinen automatisch im Browser und lassen sich direkt installieren — ohne externe Seite, ohne Umweg.',
    portalOSUpdatesHint:
      'Neue Versionen erscheinen als Benachrichtigungsleiste unten im Browser.'
  },

  changelog: {
    eyebrow: 'CHANGELOG',
    title: 'Was ist neu',
    releases: [
      {
        version: '1.0.3',
        date: '2025',
        tag: 'DOWNLOAD-MANAGER · AUTO-UPDATE CHANGELOG · FOKUS-REDESIGN',
        items: [
          'Download-Manager vollständig neu gebaut — Chrome-Stil mit Fortschrittsbalken, Echtzeit-Geschwindigkeit, verbleibender Zeit und Dateigrößenanzeige',
          'Download-Aktionen: Datei direkt öffnen, Im Ordner anzeigen, Laufende Downloads abbrechen',
          'Crash-Fix: "Object has been destroyed" Fehler im Download-Handler vollständig behoben',
          'Auto-Update mit Changelog — neue Version zeigt "Was ist neu" direkt im Browser bevor installiert wird',
          'Landeseite massiv überarbeitet — Fokus-Philosophie, Dark-by-Design Manifesto, neue Philosophie-Sektion',
          'Alle Browser-Texte auf Minimalism & Fokus ausgerichtet — kein "Cinematic", kein Lärm',
          'Footer verbessert: Tagline, Open-Source-Hinweis, saubereres Layout'
        ]
      },
      {
        version: '1.0.2',
        date: '2025',
        tag: 'STUDOX CORE · I18N · TAB-GRUPPEN',
        items: [
          'StudoX Core — direkter Zugang zu core.studox.eu per Titelleisten-Button oder Strg+Umschalt+S, mit filmischem 2-Sekunden-Übergangseffekt',
          'Vollständiges Sprachsystem — Deutsch und Englisch, über 150 Übersetzungsschlüssel, Sprachauswahl in Einstellungen > Sprachen',
          'Tab-Gruppen (Opera GX-Stil) — 8 Farben, ein- und ausklappbar, umbenennen per Doppelklick, Kontextmenü',
          'Neue Einstellungsseite — 10 Bereiche mit Suchfunktion, Seitenleistennavigation und Live-Suche',
          'Fenster-Drag vollständig behoben — leere Tab-Leistenbereiche sind wieder ziehbar wie in Chrome',
          'Zeitbasierte Begrüßungen auf dem neuen Tab — GUTEN MORGEN / TAG / ABEND / NACHT',
          'StudoX Core erreichbar über Titelleisten-Button, Omnibox-Aktion, New Tab Seite und Hotkey'
        ]
      },
      {
        version: '1.0.1',
        date: '2025',
        tag: 'FLÜSSIGKEIT · STABILITÄT · RESPONSIVITÄT',
        items: [
          'Tab-Schließanimation butterweich gemacht — neues Federsystem, keine Layout-Sprünge mehr',
          'New Tab Seite neugestaltet — violetter Tiefenglanz, gestaffelte Eingangsanimationen, sauberere Struktur',
          'Suchleiste skaliert und leuchtet beim Fokus — physikbasierte Box-Shadow-Animation',
          'Three.js-Szene erweitert — Torus-Knoten mit Atemskala, doppelte Partikelfelder (8000 nah + 2000 fern), Tiefennebel',
          'Langsame Auto-Drift-Kamera — subtile Bewegung unabhängig von Mauseingaben',
          'Vollständig responsiv von 900px bis 5120px — optimiert für 4K und Ultrawide',
          'Navbar mit mobilem Hamburger-Menü',
          'Scroll-Parallax im Hero-Bereich — Opacity und Scale beim Scrollen'
        ]
      },
      {
        version: '1.0.0',
        date: '2025',
        tag: 'ERSTVERÖFFENTLICHUNG',
        items: [
          'Vollständige Chromium-Browser-Engine via Electron 33 — keine eingeschränkte WebView, echtes Browsing',
          'Dark-native UI-Shell — kein nativer Chrome sichtbar, jedes Element selbst designed',
          'Immersiver 3D New Tab mit Three.js Wireframe-Szene und Maus-Parallax',
          'Boot-Sequenz mit Monospace-Tipp-Animation',
          'Befehlspalette (Strg+K) — Tabs, Verlauf, Lesezeichen und Aktionen unified durchsuchen',
          'Tab-Verwaltung — erstellen, schließen, duplizieren, stummschalten, neu anordnen, Kontextmenü',
          'Lesezeichen-System mit Stern-Symbol in der Adressleiste, SQLite-Persistenz',
          'Verlaufspanel (Strg+Y) mit Suche und zeitgruppierten Einträgen',
          'Suche auf Seite (Strg+F) via nativer Chromium-Integration',
          'Download-Manager mit Fortschrittsverfolgung',
          'Zoom-Steuerung pro Tab (Strg+/−/0)',
          'Konfigurierbare Suchmaschine — Google, DuckDuckGo, Brave, Bing, Kagi',
          'Auto-Updater via GitHub Releases — nahtlose Hintergrundaktualisierungen',
          'Windows NSIS-Installer, macOS DMG, Linux AppImage',
          'HTTPS-Sicherheitsanzeige und HTTP-Warnung in der Adressleiste',
          'Eingebaute Absturz-Wiederherstellungsseite',
          'Vollständige Tastaturkürzel für alle Kernoperationen'
        ]
      }
    ]
  }
}

// ─────────────────────────────────────────────
//  ENGLISH
// ─────────────────────────────────────────────

const en: Translations = {
  nav: {
    features: 'Features',
    download: 'Download',
    changelog: 'Changelog'
  },

  home: {
    eyebrow: `v${VERSION} — PORTAL OS · STUDOX`,

    subtitle:
      "The only browser that doesn't fight\nfor your attention.\nNative dark. Zero noise.",

    downloadBtn: 'Download for Windows',
    githubBtn: 'GitHub →',
    platforms: 'WINDOWS · MACOS · LINUX',
    scroll: 'SCROLL',

    // ── Features section ──
    featuresLabel: 'WHY PORTAL OS',
    featuresTitle1: 'Other browsers were',
    featuresTitle2: 'built for distraction.',
    featuresSubtitle:
      'Portal OS was not. Every design decision, every color, every interaction was made with one goal: to protect your focus — not steal it.',

    // ── Philosophy section ──
    philosophyLabel: 'DESIGN PHILOSOPHY',
    philosophyTitle: 'White is noise.\nDark is focus.',
    philosophyDesc:
      'Your visual system responds to brightness. Bright surfaces trigger alertness and accelerate cognitive stimulus processing — the exact opposite of deep concentration. Portal OS is dark-native: not as a design trend, but as a deliberate decision for your mental space. Every pixel was designed for darkness. No afterthought. No toggle.',

    principles: [
      {
        glyph: '◼',
        title: 'Dark by Design',
        desc: 'No dark mode toggle. No light mode option. Portal OS exists only in darkness — every contrast, every text color, every UI element was designed for dark screens from the start. The result is an interface that does not burn after hours of use.'
      },
      {
        glyph: '◻',
        title: 'Silence by Default',
        desc: "What isn't there can't distract. No news feed on startup, no sponsored suggestions, no notification walls, no algorithm deciding what you should see next. Your starting point is silence — not someone else's content."
      },
      {
        glyph: '◈',
        title: 'Tool, Not Platform',
        desc: 'A browser should open the web — not become content itself. Portal OS steps back. The interface is deliberately reduced so your work, your study material, your thought can become visible — without competing for attention.'
      }
    ],

    // ── Tech stack ──
    techLabel: 'TECH STACK',
    techTitle: 'Built to last.',
    techDesc:
      'No experiments, no proprietary lock-in. Portal OS builds on proven open-source technologies — and adds the layer that makes them focused.',

    // ── CTA ──
    ctaTitle1: 'Less',
    ctaTitle2: 'noise.',
    ctaDesc:
      'Portal OS is free, open-source, and built for people who understand: real focus does not begin with an app feature — it begins with the right environment.',
    ctaBtn: 'Download Portal OS',

    // ── 6 Features ──
    features: [
      {
        tag: 'FOCUS',
        glyph: '◈',
        title: 'Quiet Starting Point',
        description:
          'No news feed, no sponsored recommendations, no thumbnail grid reaching for your attention. When you open a new tab you see: yourself. A search bar. Silence. Nothing that distracts you before you have even started to think.'
      },
      {
        tag: 'NAVIGATE',
        glyph: '⬡',
        title: 'Command Palette (Ctrl+K)',
        description:
          'Navigate tabs, history, bookmarks, and quick actions without mouse, without menu hierarchy, without interrupting your flow. The palette appears when you need it and disappears when you are done. Present when necessary — invisible when not.'
      },
      {
        tag: 'ENGINE',
        glyph: '◉',
        title: 'Full Chromium Engine',
        description:
          'Same rendering engine as Chrome. Every website, every web app, all modern standards — without compromise. Portal OS gives you focus without sacrificing compatibility. Your tools work. Your workflow stays unbroken.'
      },
      {
        tag: 'PRIVATE',
        glyph: '⬢',
        title: 'No Account. No Cloud. No Tracking.',
        description:
          'Your browsing data stays on your device. No sign-in, no sync to foreign servers, no telemetry phoning home. The built-in ad blocker also removes one of the most persistent attention thieves on the web.'
      },
      {
        tag: 'DARK',
        glyph: '✦',
        title: 'Dark-Native by Design',
        description:
          'Portal OS does not have a dark mode — it is dark. From the tab bar to the last context menu, every element was designed for dark screens, not added as a toggle. Your eyes will notice the difference after four hours of work.'
      },
      {
        tag: 'RELIABLE',
        glyph: '◆',
        title: 'Updates That Do Not Interrupt',
        description:
          'New versions download in the background via GitHub Releases. You decide when to install — no forced restart, no pop-up tearing through your flow. See exactly what changed in the browser as a changelog before updating.'
      }
    ]
  },

  footer: {
    download: 'Download',
    changelog: 'Changelog',
    builtBy: 'BUILT BY JOHANNESAFK · STUDOX',
    tagline: 'FOCUS IS AN ENVIRONMENT'
  },

  download: {
    eyebrow: 'DOWNLOAD',
    title: 'Get Portal OS',
    versionLabel: `Version ${VERSION} — Free and open-source`,
    detected: 'DETECTED',
    downloadBtn: 'Download',
    releaseInfo:
      'All releases are built automatically via GitHub Actions and published to GitHub Releases.',
    viewAll: 'View all releases on GitHub →',
    portalOSDetected: "You're already using Portal OS",
    portalOSDetectedDesc:
      "You're browsing with Portal OS right now. Updates appear automatically in the browser and can be installed directly — no external page, no detour.",
    portalOSUpdatesHint:
      'New versions appear as a notification bar at the bottom of the browser.'
  },

  changelog: {
    eyebrow: 'CHANGELOG',
    title: "What's New",
    releases: [
      {
        version: '1.0.3',
        date: '2025',
        tag: 'DOWNLOAD MANAGER · AUTO-UPDATE CHANGELOG · FOCUS REDESIGN',
        items: [
          'Download manager completely rebuilt — Chrome-style with progress bar, real-time speed, time remaining, and file size display',
          'Download actions: open file directly, show in folder, cancel active downloads',
          'Crash fix: "Object has been destroyed" error in download handler fully resolved',
          'Auto-update with changelog — new version shows "What\'s new" directly in the browser before installing',
          'Landing page massively redesigned — focus philosophy, dark-by-design manifesto, new philosophy section',
          'All browser copy reoriented toward minimalism and focus — no more "cinematic", no noise',
          'Footer improved: tagline, open-source note, cleaner layout'
        ]
      },
      {
        version: '1.0.2',
        date: '2025',
        tag: 'STUDOX CORE · I18N · TAB GROUPS',
        items: [
          'StudoX Core — direct access to core.studox.eu via title bar button or Ctrl+Shift+S, with cinematic 2-second transition effect',
          'Full i18n system — English and German, 150+ translation keys, language picker in Settings > Languages',
          'Tab Groups (Opera GX style) — 8 colors, collapsible, rename by double-click, context menu',
          'New Settings page — 10 sections with sidebar navigation and live search across all settings',
          'Window drag fully fixed — empty tab bar space is draggable again, like Chrome',
          'Time-based greetings on the new tab — GOOD MORNING / AFTERNOON / EVENING / NIGHT',
          'StudoX Core accessible from title bar button, omnibox action, new tab page hero, hotkey'
        ]
      },
      {
        version: '1.0.1',
        date: '2025',
        tag: 'SMOOTHNESS · STABILITY · RESPONSIVENESS',
        items: [
          'Tab close animation made buttery smooth — new spring system, no more layout jumps',
          'New tab page redesigned — violet depth glow, staggered entrance animations, cleaner structure',
          'Search bar scales and glows on focus — physics-based box-shadow animation',
          'Three.js scene expanded — torus knot with breathing scale, dual particle fields (8000 near + 2000 far), depth fog',
          'Slow auto-drift camera — subtle movement independent of mouse input',
          'Fully responsive from 900px to 5120px — optimized for 4K and ultrawide',
          'Navbar with mobile hamburger menu',
          'Scroll parallax in hero section — opacity and scale on scroll'
        ]
      },
      {
        version: '1.0.0',
        date: '2025',
        tag: 'INITIAL RELEASE',
        items: [
          'Full Chromium browsing engine via Electron 33 — no restricted WebView, real browsing',
          'Dark-native UI shell — no native Chrome chrome visible, every element self-designed',
          'Immersive 3D new tab with Three.js wireframe scene and mouse parallax',
          'Boot sequence with monospace typing animation',
          'Command palette (Ctrl+K) — tabs, history, bookmarks, and actions unified',
          'Tab management — create, close, duplicate, mute, reorder, context menu',
          'Bookmark system with star icon in address bar, SQLite persistence',
          'History panel (Ctrl+Y) with search and time-grouped entries',
          'Find in page (Ctrl+F) via native Chromium integration',
          'Download manager with progress tracking',
          'Per-tab zoom controls (Ctrl+/−/0)',
          'Configurable search engine — Google, DuckDuckGo, Brave, Bing, Kagi',
          'Auto-updater via GitHub Releases — seamless background updates',
          'Windows NSIS installer, macOS DMG, Linux AppImage',
          'HTTPS indicator and HTTP warning in the address bar',
          'Built-in crash recovery page',
          'Full keyboard shortcuts for all core operations'
        ]
      }
    ]
  }
}

// ─────────────────────────────────────────────
//  Platform data
// ─────────────────────────────────────────────

export function getPlatforms(locale: Locale): PlatformItem[] {
  const isDE = locale === 'de'
  return [
    {
      id: 'windows',
      name: 'Windows',
      icon: '⊞',
      file: `Portal-OS-Setup-${VERSION}.exe`,
      note: 'Windows 10+ (64-Bit)',
      format: isDE ? 'NSIS-Installer (.exe)' : 'NSIS Installer (.exe)'
    },
    {
      id: 'macos',
      name: 'macOS',
      icon: '⌘',
      file: `Portal-OS-${VERSION}-arm64.dmg`,
      note: 'macOS 11+ (Apple Silicon & Intel)',
      format: isDE ? 'Disk-Image (.dmg)' : 'Disk Image (.dmg)'
    },
    {
      id: 'linux',
      name: 'Linux',
      icon: '◆',
      file: `Portal-OS-${VERSION}-x64.AppImage`,
      note: isDE ? 'Ubuntu 20.04+ / Fedora 36+ (64-Bit)' : 'Ubuntu 20.04+ / Fedora 36+ (64-bit)',
      format: 'AppImage'
    }
  ]
}

export const DOWNLOAD_BASE = BASE

const translations: Record<Locale, Translations> = { de, en }

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations.de
}

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  GearSix,
  Palette,
  Rows,
  ShieldCheck,
  MagnifyingGlass,
  DownloadSimple,
  Translate,
  Keyboard,
  Cpu,
  Info,
  ArrowClockwise
} from '@phosphor-icons/react'
import { useUIStore } from '@store/ui.store'
import { useSettingsStore } from '@store/settings.store'
import { useI18nStore } from '@store/i18n.store'
import { locales, type Locale } from '@lib/i18n'
import { springStandard, overlayVariants, duration } from '@lib/motion'

type Section =
  | 'general'
  | 'appearance'
  | 'tabs'
  | 'privacy'
  | 'search'
  | 'downloads'
  | 'language'
  | 'shortcuts'
  | 'system'
  | 'about'

const accentPresets = [
  { name: 'Violet', color: '#7c6af7' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Cyan', color: '#06b6d4' },
  { name: 'Green', color: '#10b981' },
  { name: 'Rose', color: '#f43f5e' },
  { name: 'Orange', color: '#f97316' },
  { name: 'White', color: '#e2e2e2' }
]

const searchEngines: { id: 'google' | 'duckduckgo' | 'brave' | 'bing' | 'kagi'; name: string; url: string }[] = [
  { id: 'google', name: 'Google', url: 'google.com' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'duckduckgo.com' },
  { id: 'brave', name: 'Brave Search', url: 'search.brave.com' },
  { id: 'bing', name: 'Bing', url: 'bing.com' },
  { id: 'kagi', name: 'Kagi', url: 'kagi.com' }
]

const shortcuts: { key: string; action: string }[] = [
  { key: 'Ctrl+T', action: 'New tab' },
  { key: 'Ctrl+W', action: 'Close tab' },
  { key: 'Ctrl+Shift+T', action: 'Reopen last closed tab' },
  { key: 'Ctrl+L', action: 'Focus address bar' },
  { key: 'Ctrl+K', action: 'Open command palette' },
  { key: 'Ctrl+R', action: 'Reload' },
  { key: 'Ctrl+Shift+R', action: 'Hard reload' },
  { key: 'Ctrl+[', action: 'Go back' },
  { key: 'Ctrl+]', action: 'Go forward' },
  { key: 'Ctrl+1…9', action: 'Switch to tab' },
  { key: 'Ctrl+Y', action: 'Open history' },
  { key: 'Ctrl+D', action: 'Bookmark page' },
  { key: 'Ctrl+F', action: 'Find in page' },
  { key: 'Ctrl+,', action: 'Open settings' },
  { key: 'Ctrl+Shift+B', action: 'Toggle sidebar' },
  { key: 'Ctrl++', action: 'Zoom in' },
  { key: 'Ctrl+-', action: 'Zoom out' },
  { key: 'Ctrl+0', action: 'Reset zoom' },
  { key: 'F12', action: 'Open DevTools' },
  { key: 'Escape', action: 'Close overlays / stop loading' }
]

export default function Settings(): JSX.Element {
  const t = useI18nStore((s) => s.t)
  const settingsOpen = useUIStore((s) => s.settingsOpen)
  const settingsSection = useUIStore((s) => s.settingsSection)
  const setSettings = useUIStore((s) => s.setSettings)
  const [active, setActive] = useState<Section>((settingsSection as Section) || 'general')
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (settingsOpen && settingsSection) {
      setActive(settingsSection as Section)
    }
  }, [settingsOpen, settingsSection])

  useEffect(() => {
    // Focus search on open
    setTimeout(() => searchRef.current?.focus(), 100)
  }, [])

  const sections: { id: Section; label: string; icon: JSX.Element }[] = useMemo(
    () => [
      { id: 'general', label: t.settings.sections.general, icon: <GearSix size={14} /> },
      { id: 'appearance', label: t.settings.sections.appearance, icon: <Palette size={14} /> },
      { id: 'tabs', label: t.settings.sections.tabs, icon: <Rows size={14} /> },
      { id: 'privacy', label: t.settings.sections.privacy, icon: <ShieldCheck size={14} /> },
      { id: 'search', label: t.settings.sections.search, icon: <MagnifyingGlass size={14} /> },
      { id: 'downloads', label: t.settings.sections.downloads, icon: <DownloadSimple size={14} /> },
      { id: 'language', label: t.settings.sections.language, icon: <Translate size={14} /> },
      { id: 'shortcuts', label: t.settings.sections.shortcuts, icon: <Keyboard size={14} /> },
      { id: 'system', label: t.settings.sections.system, icon: <Cpu size={14} /> },
      { id: 'about', label: t.settings.sections.about, icon: <Info size={14} /> }
    ],
    [t]
  )

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections
    const q = searchQuery.toLowerCase()
    return sections.filter((s) => s.label.toLowerCase().includes(q))
  }, [sections, searchQuery])

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration.mid }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
        onClick={() => setSettings(false)}
      />

      {/* Settings panel */}
      <motion.div
        className="relative m-auto flex flex-col overflow-hidden"
        style={{
          width: 'min(960px, 94vw)',
          height: 'min(680px, 88vh)',
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.7)'
        }}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={springStandard}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-6 shrink-0"
          style={{ height: 56, borderBottom: '1px solid var(--border-dim)' }}
        >
          <div className="flex items-center gap-3">
            <GearSix size={16} className="opacity-60" />
            <h2 className="text-[15px] font-light" style={{ color: 'var(--text-primary)' }}>
              {t.settings.title}
            </h2>
          </div>

          {/* Search */}
          <div
            className="flex items-center gap-2 h-8 px-3 rounded-lg flex-1 max-w-[320px] mx-6"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-dim)'
            }}
          >
            <MagnifyingGlass size={12} className="opacity-30" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.settings.searchPlaceholder}
              className="flex-1 bg-transparent border-none outline-none text-[12px] text-white/85 placeholder:text-white/25"
              spellCheck={false}
              aria-label={t.settings.searchPlaceholder}
            />
          </div>

          <button
            onClick={() => setSettings(false)}
            className="w-7 h-7 flex items-center justify-center rounded-md opacity-40 hover:opacity-80 hover:bg-white/5 transition-colors"
            aria-label={t.common.close}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar nav */}
          <div
            className="w-[220px] shrink-0 py-4 px-2 flex flex-col gap-0.5 overflow-y-auto"
            style={{ borderRight: '1px solid var(--border-dim)' }}
          >
            {filteredSections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-colors text-left"
                style={{
                  background: active === s.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: active === s.id ? 'var(--text-primary)' : 'var(--text-tertiary)'
                }}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div
            className="flex-1 overflow-y-auto"
            style={{
              padding: 'clamp(24px, 3vw, 40px)',
              scrollbarWidth: 'thin'
            }}
          >
            <SectionHeading>{sections.find((s) => s.id === active)?.label}</SectionHeading>

            {active === 'general' && <GeneralSection />}
            {active === 'appearance' && <AppearanceSection />}
            {active === 'tabs' && <TabsSection />}
            {active === 'privacy' && <PrivacySection />}
            {active === 'search' && <SearchSection />}
            {active === 'downloads' && <DownloadsSection />}
            {active === 'language' && <LanguageSection />}
            {active === 'shortcuts' && <ShortcutsSection />}
            {active === 'system' && <SystemSection />}
            {active === 'about' && <AboutSection />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════
//  SHARED UI
// ══════════════════════════════════════════════════════════════

function SectionHeading({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <h3
      className="font-light mb-6"
      style={{
        color: 'var(--text-primary)',
        fontSize: 'clamp(18px, 1.6vw, 22px)',
        letterSpacing: '-0.01em'
      }}
    >
      {children}
    </h3>
  )
}

function Card({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div
      className="rounded-xl p-5 mb-3"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-dim)'
      }}
    >
      {children}
    </div>
  )
}

function Row({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: React.ReactNode
}): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-6 py-2">
      <div className="flex-1 min-w-0">
        <div className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
          {title}
        </div>
        {description && (
          <div className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            {description}
          </div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({
  checked,
  onChange
}: {
  checked: boolean
  onChange: (v: boolean) => void
}): JSX.Element {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-9 h-5 rounded-full relative transition-colors"
      style={{ background: checked ? 'var(--accent)' : 'rgba(255,255,255,0.1)' }}
      aria-checked={checked}
      role="switch"
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 rounded-full"
        style={{ background: '#fff' }}
        animate={{ x: checked ? 18 : 2 }}
        transition={{ type: 'spring', stiffness: 600, damping: 35 }}
      />
    </button>
  )
}

function Select<T extends string>({
  value,
  onChange,
  options
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}): JSX.Element {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="bg-transparent text-[12px] px-3 py-1.5 rounded-md outline-none cursor-pointer"
      style={{
        border: '1px solid var(--border-subtle)',
        color: 'var(--text-secondary)'
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: 'var(--bg-surface)' }}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

// ══════════════════════════════════════════════════════════════
//  SECTIONS
// ══════════════════════════════════════════════════════════════

function GeneralSection(): JSX.Element {
  const t = useI18nStore((s) => s.t)
  const startupMode = useSettingsStore((s) => s.startupMode)
  const setStartupMode = useSettingsStore((s) => s.setStartupMode)
  const launchAtLogin = useSettingsStore((s) => s.launchAtLogin)
  const setLaunchAtLogin = useSettingsStore((s) => s.setLaunchAtLogin)
  const hardwareAcceleration = useSettingsStore((s) => s.hardwareAcceleration)
  const setHardwareAcceleration = useSettingsStore((s) => s.setHardwareAcceleration)

  return (
    <>
      <Card>
        <div
          className="text-[10px] tracking-[0.15em] mb-3"
          style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
        >
          {t.settings.startupTitle.toUpperCase()}
        </div>
        <div className="flex flex-col gap-1">
          {[
            { value: 'newtab' as const, label: t.settings.startupNewTab },
            { value: 'continue' as const, label: t.settings.startupContinue },
            { value: 'specific' as const, label: t.settings.startupSpecific }
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStartupMode(opt.value)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors"
              style={{
                background: startupMode === opt.value ? 'var(--accent-dim)' : 'transparent',
                border: startupMode === opt.value
                  ? '1px solid rgba(124,106,247,0.25)'
                  : '1px solid transparent'
              }}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0 flex items-center justify-center"
                style={{
                  border: `1px solid ${startupMode === opt.value ? 'var(--accent)' : 'var(--border-subtle)'}`
                }}
              >
                {startupMode === opt.value && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                )}
              </div>
              <span className="text-[12px]" style={{ color: 'var(--text-primary)' }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <Row title={t.settings.openAtLogin} description={t.settings.openAtLoginDesc}>
          <Toggle checked={launchAtLogin} onChange={setLaunchAtLogin} />
        </Row>
      </Card>

      <Card>
        <Row
          title={t.settings.hardwareAcceleration}
          description={t.settings.hardwareAccelerationDesc}
        >
          <Toggle checked={hardwareAcceleration} onChange={setHardwareAcceleration} />
        </Row>
      </Card>
    </>
  )
}

function AppearanceSection(): JSX.Element {
  const t = useI18nStore((s) => s.t)
  const accentColor = useSettingsStore((s) => s.accentColor)
  const setAccentColor = useSettingsStore((s) => s.setAccentColor)
  const fontSize = useSettingsStore((s) => s.fontSize)
  const setFontSize = useSettingsStore((s) => s.setFontSize)
  const reduceMotion = useSettingsStore((s) => s.reduceMotion)
  const setReduceMotion = useSettingsStore((s) => s.setReduceMotion)

  return (
    <>
      <Card>
        <Row title={t.settings.themeTitle} description={t.settings.themeDescription}>
          <span className="text-[11px] px-2.5 py-1 rounded-md"
            style={{
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
              border: '1px solid rgba(124,106,247,0.2)'
            }}
          >
            DARK
          </span>
        </Row>
      </Card>

      <Card>
        <div
          className="text-[10px] tracking-[0.15em] mb-4"
          style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
        >
          {t.settings.accentColorTitle.toUpperCase()}
        </div>
        <div className="flex gap-2.5 flex-wrap mb-2">
          {accentPresets.map((p) => (
            <button
              key={p.color}
              onClick={() => setAccentColor(p.color)}
              className="w-8 h-8 rounded-full transition-transform hover:scale-110"
              style={{
                background: p.color,
                boxShadow:
                  accentColor === p.color
                    ? `0 0 0 2px var(--bg-base), 0 0 0 4px ${p.color}`
                    : 'none'
              }}
              title={p.name}
              aria-label={p.name}
            />
          ))}
        </div>
        <div className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>
          {t.settings.accentColorDesc}
        </div>
      </Card>

      <Card>
        <Row
          title={t.settings.fontSizeTitle}
          description={`${fontSize}px — ${t.settings.fontSizeDesc}`}
        >
          <input
            type="range"
            min={12}
            max={18}
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
            className="w-28"
            style={{ accentColor: 'var(--accent)' }}
          />
        </Row>
      </Card>

      <Card>
        <Row title={t.settings.reduceMotionTitle} description={t.settings.reduceMotionDesc}>
          <Toggle checked={reduceMotion} onChange={setReduceMotion} />
        </Row>
      </Card>
    </>
  )
}

function TabsSection(): JSX.Element {
  const t = useI18nStore((s) => s.t)
  const tabStyle = useSettingsStore((s) => s.tabStyle)
  const setTabStyle = useSettingsStore((s) => s.setTabStyle)
  const tabGroupsEnabled = useSettingsStore((s) => s.tabGroupsEnabled)
  const setTabGroupsEnabled = useSettingsStore((s) => s.setTabGroupsEnabled)
  const closeTabBehavior = useSettingsStore((s) => s.closeTabBehavior)
  const setCloseTabBehavior = useSettingsStore((s) => s.setCloseTabBehavior)

  return (
    <>
      <Card>
        <Row title={t.settings.tabStyleTitle}>
          <Select
            value={tabStyle}
            onChange={setTabStyle}
            options={[
              { value: 'compact', label: t.settings.tabStyleCompact },
              { value: 'default', label: t.settings.tabStyleDefault },
              { value: 'spacious', label: t.settings.tabStyleSpacious }
            ]}
          />
        </Row>
      </Card>

      <Card>
        <Row title={t.settings.tabGroupsTitle} description={t.settings.tabGroupsDesc}>
          <Toggle checked={tabGroupsEnabled} onChange={setTabGroupsEnabled} />
        </Row>
      </Card>

      <Card>
        <Row title={t.settings.closeTabBehaviorTitle}>
          <Select
            value={closeTabBehavior}
            onChange={setCloseTabBehavior}
            options={[
              { value: 'left', label: t.settings.closeTabBehaviorLeft },
              { value: 'right', label: t.settings.closeTabBehaviorRight },
              { value: 'lastActive', label: t.settings.closeTabBehaviorLastActive }
            ]}
          />
        </Row>
      </Card>
    </>
  )
}

function PrivacySection(): JSX.Element {
  const t = useI18nStore((s) => s.t)
  const blockAds = useSettingsStore((s) => s.blockAds)
  const setBlockAds = useSettingsStore((s) => s.setBlockAds)
  const doNotTrack = useSettingsStore((s) => s.doNotTrack)
  const setDoNotTrack = useSettingsStore((s) => s.setDoNotTrack)

  return (
    <>
      <Card>
        <Row title={t.settings.blockAdsTitle} description={t.settings.blockAdsDesc}>
          <Toggle checked={blockAds} onChange={setBlockAds} />
        </Row>
      </Card>

      <Card>
        <Row title={t.settings.doNotTrackTitle} description={t.settings.doNotTrackDesc}>
          <Toggle checked={doNotTrack} onChange={setDoNotTrack} />
        </Row>
      </Card>

      <Card>
        <Row title={t.settings.clearHistoryTitle} description={t.settings.clearHistoryDesc}>
          <DangerButton label={t.settings.clearHistoryButton} onClick={() => window.portalOS.db.clearHistory()} />
        </Row>
      </Card>

      <Card>
        <Row title={t.settings.clearCookiesTitle} description={t.settings.clearCookiesDesc}>
          <DangerButton label={t.settings.clearCookiesButton} onClick={() => {/* IPC: clear cookies */}} />
        </Row>
      </Card>

      <Card>
        <Row title={t.settings.clearCacheTitle} description={t.settings.clearCacheDesc}>
          <DangerButton label={t.settings.clearCacheButton} onClick={() => {/* IPC: clear cache */}} />
        </Row>
      </Card>
    </>
  )
}

function SearchSection(): JSX.Element {
  const t = useI18nStore((s) => s.t)
  const searchEngine = useSettingsStore((s) => s.searchEngine)
  const setSearchEngine = useSettingsStore((s) => s.setSearchEngine)

  return (
    <Card>
      <div
        className="text-[10px] tracking-[0.15em] mb-4"
        style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
      >
        {t.settings.defaultSearchEngine.toUpperCase()}
      </div>
      <div className="text-[11px] mb-4" style={{ color: 'var(--text-disabled)' }}>
        {t.settings.searchEngineDesc}
      </div>
      <div className="flex flex-col gap-1.5">
        {searchEngines.map((eng) => (
          <button
            key={eng.id}
            onClick={() => setSearchEngine(eng.id)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors"
            style={{
              background: searchEngine === eng.id ? 'var(--accent-dim)' : 'transparent',
              border:
                searchEngine === eng.id
                  ? '1px solid rgba(124,106,247,0.25)'
                  : '1px solid var(--border-dim)'
            }}
          >
            <div>
              <div className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                {eng.name}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-disabled)' }}>
                {eng.url}
              </div>
            </div>
            {searchEngine === eng.id && (
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
            )}
          </button>
        ))}
      </div>
    </Card>
  )
}

function DownloadsSection(): JSX.Element {
  const t = useI18nStore((s) => s.t)
  const askWhereToSave = useSettingsStore((s) => s.askWhereToSave)
  const setAskWhereToSave = useSettingsStore((s) => s.setAskWhereToSave)
  const downloadLocation = useSettingsStore((s) => s.downloadLocation)

  return (
    <>
      <Card>
        <Row
          title={t.settings.downloadLocation}
          description={downloadLocation || t.settings.downloadLocationDesc}
        >
          <button
            className="text-[11px] px-3 py-1.5 rounded-md transition-colors hover:bg-white/5"
            style={{
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            Change
          </button>
        </Row>
      </Card>

      <Card>
        <Row title={t.settings.askWhereToSave} description={t.settings.askWhereToSaveDesc}>
          <Toggle checked={askWhereToSave} onChange={setAskWhereToSave} />
        </Row>
      </Card>
    </>
  )
}

function LanguageSection(): JSX.Element {
  const t = useI18nStore((s) => s.t)
  const locale = useI18nStore((s) => s.locale)
  const setLocaleI18n = useI18nStore((s) => s.setLocale)
  const setLocaleSettings = useSettingsStore((s) => s.setLocale)
  const spellCheck = useSettingsStore((s) => s.spellCheck)
  const setSpellCheck = useSettingsStore((s) => s.setSpellCheck)

  const handleLocaleChange = (l: Locale): void => {
    setLocaleI18n(l)
    setLocaleSettings(l)
  }

  return (
    <>
      <Card>
        <div
          className="text-[10px] tracking-[0.15em] mb-4"
          style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
        >
          {t.settings.languageTitle.toUpperCase()}
        </div>
        <div className="text-[11px] mb-4" style={{ color: 'var(--text-disabled)' }}>
          {t.settings.languageDesc}
        </div>
        <div className="flex flex-col gap-1.5">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => handleLocaleChange(l.code)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors"
              style={{
                background: locale === l.code ? 'var(--accent-dim)' : 'transparent',
                border:
                  locale === l.code
                    ? '1px solid rgba(124,106,247,0.25)'
                    : '1px solid var(--border-dim)'
              }}
            >
              <div>
                <div className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                  {l.native}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-disabled)' }}>
                  {l.label}
                </div>
              </div>
              {locale === l.code && (
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
              )}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <Row title={t.settings.spellCheckTitle} description={t.settings.spellCheckDesc}>
          <Toggle checked={spellCheck} onChange={setSpellCheck} />
        </Row>
      </Card>
    </>
  )
}

function ShortcutsSection(): JSX.Element {
  const t = useI18nStore((s) => s.t)
  return (
    <Card>
      <div className="text-[11px] mb-4" style={{ color: 'var(--text-disabled)' }}>
        {t.settings.shortcutsDesc}
      </div>
      <div className="flex flex-col gap-0.5">
        {shortcuts.map((s) => (
          <div
            key={s.key}
            className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-white/[0.02]"
          >
            <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
              {s.action}
            </span>
            <kbd
              className="text-[10px] px-2 py-0.5 rounded"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-dim)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-tertiary)'
              }}
            >
              {s.key}
            </kbd>
          </div>
        ))}
      </div>
    </Card>
  )
}

function SystemSection(): JSX.Element {
  const t = useI18nStore((s) => s.t)
  const resetAll = useSettingsStore((s) => s.resetAll)

  return (
    <Card>
      <Row title={t.settings.resetAll} description={t.settings.resetAllDesc}>
        <button
          onClick={() => {
            if (confirm(t.settings.resetAllConfirm)) {
              resetAll()
            }
          }}
          className="flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-md transition-colors hover:bg-white/5"
          style={{
            border: '1px solid var(--border-subtle)',
            color: 'var(--danger)'
          }}
        >
          <ArrowClockwise size={12} />
          {t.settings.resetAllButton}
        </button>
      </Row>
    </Card>
  )
}

function AboutSection(): JSX.Element {
  const t = useI18nStore((s) => s.t)
  const versions = window.portalOS.versions
  const [updateStatus, setUpdateStatus] = useState('')

  function checkForUpdates(): void {
    setUpdateStatus(t.settings.aboutCheckingUpdates)
    window.portalOS.updater.check()
    const unsub = window.portalOS.updater.onReady((data) => {
      setUpdateStatus(`v${data.version} — ${t.settings.aboutUpdateReady}`)
      unsub()
      unsubUp()
    })
    const unsubUp = window.portalOS.updater.onUpToDate(() => {
      setUpdateStatus(t.settings.aboutUpToDate)
      setTimeout(() => setUpdateStatus(''), 5000)
      unsub()
      unsubUp()
    })
  }

  return (
    <>
      <Card>
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{
              background: 'var(--accent-dim)',
              border: '1px solid rgba(124,106,247,0.2)'
            }}
          >
            ⬡
          </div>
          <div>
            <div className="text-[18px] font-light" style={{ color: 'var(--text-primary)' }}>
              Portal OS
            </div>
            <div
              className="text-[11px] tracking-wider"
              style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
            >
              v{versions.app}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-5">
          <VersionRow label="Chromium" value={versions.chrome} />
          <VersionRow label="Electron" value={versions.electron} />
          <VersionRow label="Node.js" value={versions.node} />
          <VersionRow label="V8" value={versions.v8} />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={checkForUpdates}
            className="px-3 py-1.5 rounded-md text-[11px] transition-colors hover:bg-white/5"
            style={{
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            {t.settings.aboutCheckUpdates}
          </button>
          {updateStatus && (
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
              {updateStatus}
            </span>
          )}
        </div>
      </Card>

      <Card>
        <div className="text-[12px] mb-2" style={{ color: 'var(--text-secondary)' }}>
          {t.settings.aboutBuiltBy}{' '}
          <span style={{ color: 'var(--text-primary)' }}>JohannesAFK</span>
          <span style={{ color: 'var(--text-disabled)' }}> · </span>
          <span style={{ color: 'var(--accent)' }}>StudoX</span>
        </div>
        <div className="text-[11px] leading-relaxed" style={{ color: 'var(--text-disabled)' }}>
          {t.settings.aboutOpenSource}
        </div>
      </Card>
    </>
  )
}

function VersionRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex justify-between text-[11px]">
      <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      <span style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>{value}</span>
    </div>
  )
}

function DangerButton({
  label,
  onClick
}: {
  label: string
  onClick: () => void
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="text-[11px] px-3 py-1.5 rounded-md transition-colors hover:bg-white/5"
      style={{
        border: '1px solid var(--border-subtle)',
        color: 'var(--danger)'
      }}
    >
      {label}
    </button>
  )
}

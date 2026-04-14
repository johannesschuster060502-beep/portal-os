import { useState } from 'react'
import { motion } from 'framer-motion'
import { springStandard, overlayVariants, duration } from '@lib/motion'
import { X, Gear, Palette, ShieldCheck, MagnifyingGlass, Info } from '@phosphor-icons/react'
import { useUIStore } from '@store/ui.store'
import { useSettingsStore } from '@store/settings.store'

type Section = 'general' | 'appearance' | 'privacy' | 'search' | 'about'

const sections: { id: Section; label: string; icon: JSX.Element }[] = [
  { id: 'general', label: 'General', icon: <Gear size={14} /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette size={14} /> },
  { id: 'privacy', label: 'Privacy', icon: <ShieldCheck size={14} /> },
  { id: 'search', label: 'Search', icon: <MagnifyingGlass size={14} /> },
  { id: 'about', label: 'About', icon: <Info size={14} /> }
]

const accentPresets = [
  { name: 'Violet', color: '#7c6af7' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Cyan', color: '#06b6d4' },
  { name: 'Green', color: '#10b981' },
  { name: 'Rose', color: '#f43f5e' },
  { name: 'Orange', color: '#f97316' },
  { name: 'White', color: '#e2e2e2' }
]

export default function Settings(): JSX.Element {
  const setSettings = useUIStore((s) => s.setSettings)
  const [activeSection, setActiveSection] = useState<Section>('general')

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
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={() => setSettings(false)}
      />

      {/* Settings panel */}
      <motion.div
        className="relative m-auto w-[720px] max-h-[80vh] flex overflow-hidden"
        style={{
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
        }}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={springStandard}
      >
        {/* Sidebar nav */}
        <div
          className="w-[180px] shrink-0 py-4 px-2 flex flex-col gap-0.5"
          style={{ borderRight: '1px solid var(--border-dim)' }}
        >
          <div
            className="text-[10px] tracking-[0.15em] px-3 mb-3"
            style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
          >
            SETTINGS
          </div>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-all text-left"
              style={{
                background: activeSection === s.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: activeSection === s.id ? 'var(--text-primary)' : 'var(--text-tertiary)'
              }}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-6 px-8" style={{ scrollbarWidth: 'thin' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light" style={{ color: 'var(--text-primary)' }}>
              {sections.find((s) => s.id === activeSection)?.label}
            </h2>
            <button
              onClick={() => setSettings(false)}
              className="w-7 h-7 flex items-center justify-center rounded-md opacity-30
                         hover:opacity-70 hover:bg-white/5 transition-all"
              aria-label="Close settings"
            >
              <X size={14} />
            </button>
          </div>

          {activeSection === 'general' && <GeneralSection />}
          {activeSection === 'appearance' && <AppearanceSection />}
          {activeSection === 'privacy' && <PrivacySection />}
          {activeSection === 'search' && <SearchSection />}
          {activeSection === 'about' && <AboutSection />}
        </div>
      </motion.div>
    </motion.div>
  )
}

function SettingsCard({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div
      className="rounded-lg p-4 mb-3"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      {children}
    </div>
  )
}

function SettingsRow({
  label,
  description,
  children
}: {
  label: string
  description?: string
  children: React.ReactNode
}): JSX.Element {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-[13px]" style={{ color: 'var(--text-primary)' }}>{label}</div>
        {description && (
          <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {description}
          </div>
        )}
      </div>
      <div className="shrink-0 ml-4">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }): JSX.Element {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-9 h-5 rounded-full transition-colors relative"
      style={{
        background: checked ? 'var(--accent)' : 'rgba(255,255,255,0.1)'
      }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
        style={{
          background: '#fff',
          transform: checked ? 'translateX(18px)' : 'translateX(2px)'
        }}
      />
    </button>
  )
}

function GeneralSection(): JSX.Element {
  const tabStyle = useSettingsStore((s) => s.tabStyle)
  const setTabStyle = useSettingsStore((s) => s.setTabStyle)

  return (
    <>
      <SettingsCard>
        <SettingsRow label="Tab style" description="Adjust the density of the tab bar">
          <select
            value={tabStyle}
            onChange={(e) => setTabStyle(e.target.value as 'compact' | 'default' | 'spacious')}
            className="bg-transparent text-[12px] px-2 py-1 rounded-md outline-none"
            style={{
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            <option value="compact">Compact</option>
            <option value="default">Default</option>
            <option value="spacious">Spacious</option>
          </select>
        </SettingsRow>
      </SettingsCard>
    </>
  )
}

function AppearanceSection(): JSX.Element {
  const accentColor = useSettingsStore((s) => s.accentColor)
  const setAccentColor = useSettingsStore((s) => s.setAccentColor)
  const fontSize = useSettingsStore((s) => s.fontSize)
  const setFontSize = useSettingsStore((s) => s.setFontSize)

  return (
    <>
      <SettingsCard>
        <div className="text-[11px] tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
          THEME
        </div>
        <SettingsRow label="Mode" description="Portal OS is dark-native">
          <span className="text-[12px]" style={{ color: 'var(--text-disabled)' }}>Dark</span>
        </SettingsRow>
      </SettingsCard>

      <SettingsCard>
        <div className="text-[11px] tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
          ACCENT COLOR
        </div>
        <div className="flex gap-2 flex-wrap">
          {accentPresets.map((preset) => (
            <button
              key={preset.color}
              onClick={() => setAccentColor(preset.color)}
              className="w-8 h-8 rounded-full transition-transform hover:scale-110"
              style={{
                background: preset.color,
                boxShadow: accentColor === preset.color
                  ? `0 0 0 2px var(--bg-base), 0 0 0 4px ${preset.color}`
                  : 'none'
              }}
              title={preset.name}
              aria-label={`Accent color: ${preset.name}`}
            />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label="Font size" description={`${fontSize}px`}>
          <input
            type="range"
            min={12}
            max={18}
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-24 accent-[var(--accent)]"
          />
        </SettingsRow>
      </SettingsCard>
    </>
  )
}

function PrivacySection(): JSX.Element {
  const blockAds = useSettingsStore((s) => s.blockAds)
  const setBlockAds = useSettingsStore((s) => s.setBlockAds)

  return (
    <>
      <SettingsCard>
        <SettingsRow label="Block ads and trackers" description="Uses built-in content blocker">
          <Toggle checked={blockAds} onChange={setBlockAds} />
        </SettingsRow>
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label="Clear browsing history" description="Delete all history entries">
          <button
            onClick={() => {
              window.portalOS.db.clearHistory()
            }}
            className="px-3 py-1.5 rounded-md text-[11px] transition-colors"
            style={{
              border: '1px solid var(--border-subtle)',
              color: 'var(--danger)',
              background: 'transparent'
            }}
          >
            Clear History
          </button>
        </SettingsRow>
      </SettingsCard>
    </>
  )
}

function SearchSection(): JSX.Element {
  const searchEngine = useSettingsStore((s) => s.searchEngine)
  const setSearchEngine = useSettingsStore((s) => s.setSearchEngine)

  const engines = [
    { id: 'google', name: 'Google', url: 'google.com' },
    { id: 'duckduckgo', name: 'DuckDuckGo', url: 'duckduckgo.com' },
    { id: 'brave', name: 'Brave Search', url: 'search.brave.com' },
    { id: 'bing', name: 'Bing', url: 'bing.com' },
    { id: 'kagi', name: 'Kagi', url: 'kagi.com' }
  ] as const

  return (
    <SettingsCard>
      <div className="text-[11px] tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
        DEFAULT SEARCH ENGINE
      </div>
      <div className="flex flex-col gap-1">
        {engines.map((eng) => (
          <button
            key={eng.id}
            onClick={() => setSearchEngine(eng.id)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left"
            style={{
              background: searchEngine === eng.id ? 'var(--accent-dim)' : 'transparent',
              border: searchEngine === eng.id ? '1px solid rgba(124,106,247,0.2)' : '1px solid transparent'
            }}
          >
            <div>
              <div className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                {eng.name}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>
                {eng.url}
              </div>
            </div>
            {searchEngine === eng.id && (
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
            )}
          </button>
        ))}
      </div>
    </SettingsCard>
  )
}

function AboutSection(): JSX.Element {
  const versions = window.portalOS.versions
  const [updateStatus, setUpdateStatus] = useState<string>('')

  function checkForUpdates(): void {
    setUpdateStatus('Checking...')
    window.portalOS.updater.check()

    const unsubReady = window.portalOS.updater.onReady((data) => {
      setUpdateStatus(`v${data.version} ready — restart to install`)
      unsubReady()
      unsubUp()
    })
    const unsubUp = window.portalOS.updater.onUpToDate(() => {
      setUpdateStatus('You are on the latest version.')
      setTimeout(() => setUpdateStatus(''), 4000)
      unsubReady()
      unsubUp()
    })
  }

  return (
    <>
      <SettingsCard>
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{
              background: 'var(--accent-dim)',
              border: '1px solid rgba(124,106,247,0.15)'
            }}
          >
            ⬡
          </div>
          <div>
            <div className="text-lg font-light" style={{ color: 'var(--text-primary)' }}>
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

        <div className="flex flex-col gap-1.5 mb-4">
          <VersionRow label="Chromium" value={versions.chrome} />
          <VersionRow label="Electron" value={versions.electron} />
          <VersionRow label="Node.js" value={versions.node} />
          <VersionRow label="V8" value={versions.v8} />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={checkForUpdates}
            className="px-3 py-1.5 rounded-md text-[11px] transition-all hover:bg-white/5"
            style={{
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            Check for updates
          </button>
          {updateStatus && (
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
              {updateStatus}
            </span>
          )}
        </div>
      </SettingsCard>

      <SettingsCard>
        <div className="text-[12px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          Built by <span style={{ color: 'var(--text-secondary)' }}>JohannesAFK (StudoX)</span>
        </div>
        <div className="text-[11px] mt-2" style={{ color: 'var(--text-disabled)' }}>
          Powered by Chromium. Open-source components licensed under MIT, BSD, and Apache 2.0.
          See the LICENSES directory for full attribution.
        </div>
      </SettingsCard>
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

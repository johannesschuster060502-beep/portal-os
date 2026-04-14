import { create } from 'zustand'

/**
 * Portal OS — Tab Groups Store (Opera GX style)
 *
 * Groups are purely a renderer concept — the main process doesn't care.
 * Tab IDs are associated with group IDs in a Map<tabId, groupId>.
 * Groups can be collapsed: collapsed groups show only the group pill,
 * all member tabs are hidden from the tab bar until expanded.
 */

export interface TabGroup {
  id: string
  name: string
  color: GroupColor
  collapsed: boolean
  createdAt: number
}

export type GroupColor =
  | 'violet'
  | 'blue'
  | 'cyan'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'pink'

export const groupColors: { key: GroupColor; hex: string; name: string }[] = [
  { key: 'violet', hex: '#7c6af7', name: 'Violet' },
  { key: 'blue', hex: '#3b82f6', name: 'Blue' },
  { key: 'cyan', hex: '#06b6d4', name: 'Cyan' },
  { key: 'green', hex: '#10b981', name: 'Green' },
  { key: 'yellow', hex: '#eab308', name: 'Yellow' },
  { key: 'orange', hex: '#f97316', name: 'Orange' },
  { key: 'red', hex: '#ef4444', name: 'Red' },
  { key: 'pink', hex: '#ec4899', name: 'Pink' }
]

export function colorHex(color: GroupColor): string {
  return groupColors.find((c) => c.key === color)?.hex ?? '#7c6af7'
}

interface GroupsStore {
  groups: TabGroup[]
  tabToGroup: Record<number, string>

  createGroup: (name?: string, color?: GroupColor) => string
  renameGroup: (id: string, name: string) => void
  setGroupColor: (id: string, color: GroupColor) => void
  deleteGroup: (id: string) => void
  toggleCollapse: (id: string) => void

  assignTab: (tabId: number, groupId: string) => void
  unassignTab: (tabId: number) => void

  getGroupForTab: (tabId: number) => TabGroup | undefined
  getTabsInGroup: (groupId: string) => number[]

  loadFromDB: () => Promise<void>
  persist: () => void
}

function nextId(): string {
  return `g_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export const useGroupsStore = create<GroupsStore>((set, get) => ({
  groups: [],
  tabToGroup: {},

  createGroup: (name, color) => {
    const id = nextId()
    const group: TabGroup = {
      id,
      name: name ?? 'New Group',
      color: color ?? pickNextColor(get().groups),
      collapsed: false,
      createdAt: Date.now()
    }
    set((s) => ({ groups: [...s.groups, group] }))
    get().persist()
    return id
  },

  renameGroup: (id, name) => {
    set((s) => ({
      groups: s.groups.map((g) => (g.id === id ? { ...g, name } : g))
    }))
    get().persist()
  },

  setGroupColor: (id, color) => {
    set((s) => ({
      groups: s.groups.map((g) => (g.id === id ? { ...g, color } : g))
    }))
    get().persist()
  },

  deleteGroup: (id) => {
    set((s) => {
      const newMap = { ...s.tabToGroup }
      for (const tabId in newMap) {
        if (newMap[tabId] === id) delete newMap[tabId]
      }
      return {
        groups: s.groups.filter((g) => g.id !== id),
        tabToGroup: newMap
      }
    })
    get().persist()
  },

  toggleCollapse: (id) => {
    set((s) => ({
      groups: s.groups.map((g) =>
        g.id === id ? { ...g, collapsed: !g.collapsed } : g
      )
    }))
    get().persist()
  },

  assignTab: (tabId, groupId) => {
    set((s) => ({ tabToGroup: { ...s.tabToGroup, [tabId]: groupId } }))
    get().persist()
  },

  unassignTab: (tabId) => {
    set((s) => {
      const newMap = { ...s.tabToGroup }
      delete newMap[tabId]
      return { tabToGroup: newMap }
    })
    get().persist()
  },

  getGroupForTab: (tabId) => {
    const s = get()
    const gid = s.tabToGroup[tabId]
    if (!gid) return undefined
    return s.groups.find((g) => g.id === gid)
  },

  getTabsInGroup: (groupId) => {
    const s = get()
    return Object.entries(s.tabToGroup)
      .filter(([, gid]) => gid === groupId)
      .map(([tid]) => parseInt(tid, 10))
  },

  loadFromDB: async () => {
    try {
      const raw = await window.portalOS.db.getSetting('tabGroups')
      const mapRaw = await window.portalOS.db.getSetting('tabGroupMap')
      if (raw) {
        const groups = JSON.parse(raw) as TabGroup[]
        set({ groups })
      }
      if (mapRaw) {
        const map = JSON.parse(mapRaw) as Record<number, string>
        set({ tabToGroup: map })
      }
    } catch {
      // Ignore parse errors — start fresh
    }
  },

  persist: () => {
    const s = get()
    window.portalOS.db.setSetting('tabGroups', JSON.stringify(s.groups))
    window.portalOS.db.setSetting('tabGroupMap', JSON.stringify(s.tabToGroup))
  }
}))

function pickNextColor(existing: TabGroup[]): GroupColor {
  const used = new Set(existing.map((g) => g.color))
  for (const c of groupColors) {
    if (!used.has(c.key)) return c.key
  }
  return 'violet'
}

import { defineStore } from 'pinia'
import type { Table, TableType, TableSpeed } from '@/types/table'

export type LobbySortBy = 'players' | 'stakes' | 'pot' | 'name'

export interface LobbyFilters {
  type: TableType | 'all'
  speed: TableSpeed | 'all'
  minBigBlind: number | null
  maxBigBlind: number | null
  minPlayers: number | null
  maxPlayers: number | null
  showFull: boolean
  showEmpty: boolean
}

interface LobbyState {
  tables: Table[]
  filters: LobbyFilters
  sortBy: LobbySortBy
  sortAscending: boolean
  selectedTableId: string | null
  isLoading: boolean
  onlineCount: number
}

const defaultFilters: LobbyFilters = {
  type: 'all',
  speed: 'all',
  minBigBlind: null,
  maxBigBlind: null,
  minPlayers: null,
  maxPlayers: null,
  showFull: true,
  showEmpty: true,
}

export const useLobbyStore = defineStore('lobby', {
  state: (): LobbyState => ({
    tables: [],
    filters: { ...defaultFilters },
    sortBy: 'players',
    sortAscending: false,
    selectedTableId: null,
    isLoading: false,
    onlineCount: 0,
  }),

  getters: {
    filteredTables(state): Table[] {
      let result = [...state.tables]
      const f = state.filters

      if (f.type !== 'all') {
        result = result.filter((t) => t.config.type === f.type)
      }

      if (f.speed !== 'all') {
        result = result.filter((t) => t.config.speed === f.speed)
      }

      if (f.minBigBlind !== null) {
        result = result.filter((t) => t.config.stakes.bigBlind >= (f.minBigBlind as number))
      }

      if (f.maxBigBlind !== null) {
        result = result.filter((t) => t.config.stakes.bigBlind <= (f.maxBigBlind as number))
      }

      if (f.minPlayers !== null) {
        result = result.filter((t) => t.playersCount >= (f.minPlayers as number))
      }

      if (f.maxPlayers !== null) {
        result = result.filter((t) => t.playersCount <= (f.maxPlayers as number))
      }

      if (!f.showFull) {
        result = result.filter((t) => t.playersCount < t.config.maxPlayers)
      }

      if (!f.showEmpty) {
        result = result.filter((t) => t.playersCount > 0)
      }

      result.sort((a, b) => {
        let cmp = 0
        if (state.sortBy === 'players') cmp = a.playersCount - b.playersCount
        else if (state.sortBy === 'stakes') cmp = a.config.stakes.bigBlind - b.config.stakes.bigBlind
        else if (state.sortBy === 'pot') cmp = a.averagePot - b.averagePot
        else if (state.sortBy === 'name') cmp = a.name.localeCompare(b.name)
        return state.sortAscending ? cmp : -cmp
      })

      return result
    },

    selectedTable(state): Table | null {
      return state.tables.find((t) => t.id === state.selectedTableId) ?? null
    },
  },

  actions: {
    setTables(tables: Table[]) {
      this.tables = tables
    },

    setFilter<K extends keyof LobbyFilters>(key: K, value: LobbyFilters[K]) {
      this.filters[key] = value
    },

    resetFilters() {
      this.filters = { ...defaultFilters }
    },

    setSortBy(sortBy: LobbySortBy, ascending = false) {
      this.sortBy = sortBy
      this.sortAscending = ascending
    },

    selectTable(id: string | null) {
      this.selectedTableId = id
    },

    setOnlineCount(count: number) {
      this.onlineCount = count
    },
  },
})

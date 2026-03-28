import { defineStore } from 'pinia'
import type { Tournament, TournamentStatus, TournamentType, TournamentStanding } from '@/types/tournament'

export type TournamentSortBy = 'startTime' | 'buyIn' | 'prizePool' | 'players'

export interface TournamentFilters {
  type: TournamentType | 'all'
  status: TournamentStatus | 'all'
  minBuyIn: number | null
  maxBuyIn: number | null
}

interface TournamentState {
  tournaments: Tournament[]
  currentTournamentId: string | null
  filters: TournamentFilters
  sortBy: TournamentSortBy
  sortAscending: boolean
  isLoading: boolean
}

const defaultFilters: TournamentFilters = {
  type: 'all',
  status: 'all',
  minBuyIn: null,
  maxBuyIn: null,
}

export const useTournamentStore = defineStore('tournament', {
  state: (): TournamentState => ({
    tournaments: [],
    currentTournamentId: null,
    filters: { ...defaultFilters },
    sortBy: 'startTime',
    sortAscending: true,
    isLoading: false,
  }),

  getters: {
    filteredTournaments(state): Tournament[] {
      let result = [...state.tournaments]
      const f = state.filters

      if (f.type !== 'all') {
        result = result.filter((t) => t.type === f.type)
      }

      if (f.status !== 'all') {
        result = result.filter((t) => t.status === f.status)
      }

      if (f.minBuyIn !== null) {
        result = result.filter((t) => t.buyIn >= (f.minBuyIn as number))
      }

      if (f.maxBuyIn !== null) {
        result = result.filter((t) => t.buyIn <= (f.maxBuyIn as number))
      }

      result.sort((a, b) => {
        let cmp = 0
        if (state.sortBy === 'startTime') cmp = new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        else if (state.sortBy === 'buyIn') cmp = a.buyIn - b.buyIn
        else if (state.sortBy === 'prizePool') cmp = a.prizePool - b.prizePool
        else if (state.sortBy === 'players') cmp = a.registeredCount - b.registeredCount
        return state.sortAscending ? cmp : -cmp
      })

      return result
    },

    currentTournament(state): Tournament | null {
      return state.tournaments.find((t) => t.id === state.currentTournamentId) ?? null
    },

    currentStandings(): TournamentStanding[] {
      return this.currentTournament?.standings ?? []
    },

    currentBlindLevel(): number {
      return this.currentTournament?.currentLevel ?? 0
    },
  },

  actions: {
    setTournaments(tournaments: Tournament[]) {
      this.tournaments = tournaments
    },

    setCurrentTournament(id: string | null) {
      this.currentTournamentId = id
    },

    setFilter<K extends keyof TournamentFilters>(key: K, value: TournamentFilters[K]) {
      this.filters[key] = value
    },

    resetFilters() {
      this.filters = { ...defaultFilters }
    },

    setSortBy(sortBy: TournamentSortBy, ascending = true) {
      this.sortBy = sortBy
      this.sortAscending = ascending
    },

    tickNextLevel() {
      const t = this.currentTournament
      if (!t) return
      if (t.nextLevelIn > 0) {
        t.nextLevelIn -= 1
      } else {
        t.currentLevel += 1
        const nextLevel = t.blindSchedule.find((l) => l.level === t.currentLevel)
        if (nextLevel) {
          t.nextLevelIn = nextLevel.durationMinutes * 60
        }
      }
    },
  },
})

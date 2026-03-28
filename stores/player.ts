import { defineStore } from 'pinia'
import type { Player, PlayerStats, HandHistoryEntry, Achievement } from '@/types/player'

interface PlayerState {
  currentPlayer: Player | null
  isLoading: boolean
}

const defaultStats: PlayerStats = {
  handsPlayed: 0,
  handsWon: 0,
  winRate: 0,
  totalProfit: 0,
  biggestPot: 0,
  vpip: 0,
  pfr: 0,
}

export const usePlayerStore = defineStore('player', {
  state: (): PlayerState => ({
    currentPlayer: null,
    isLoading: false,
  }),

  getters: {
    isLoggedIn(state): boolean {
      return state.currentPlayer !== null
    },

    bankroll(state): number {
      return state.currentPlayer?.bankroll ?? 0
    },

    stats(state): PlayerStats {
      return state.currentPlayer?.stats ?? { ...defaultStats }
    },

    handHistory(state): HandHistoryEntry[] {
      return state.currentPlayer?.handHistory ?? []
    },

    achievements(state): Achievement[] {
      return state.currentPlayer?.achievements ?? []
    },

    unlockedAchievements(): Achievement[] {
      return this.achievements.filter((a) => a.unlockedAt !== null)
    },

    winRate(): number {
      const { handsPlayed, handsWon } = this.stats
      if (handsPlayed === 0) return 0
      return Math.round((handsWon / handsPlayed) * 100)
    },
  },

  actions: {
    setPlayer(player: Player) {
      this.currentPlayer = player
    },

    updateBankroll(delta: number) {
      if (!this.currentPlayer) return
      this.currentPlayer.bankroll += delta
    },

    addHandHistory(entry: HandHistoryEntry) {
      if (!this.currentPlayer) return
      this.currentPlayer.handHistory.unshift(entry)

      this.currentPlayer.stats.handsPlayed += 1
      if (entry.result > 0) {
        this.currentPlayer.stats.handsWon += 1
      }
      this.currentPlayer.stats.totalProfit += entry.result

      if (entry.result > this.currentPlayer.stats.biggestPot) {
        this.currentPlayer.stats.biggestPot = entry.result
      }

      const { handsPlayed, handsWon } = this.currentPlayer.stats
      this.currentPlayer.stats.winRate = handsPlayed > 0
        ? Math.round((handsWon / handsPlayed) * 100)
        : 0
    },

    unlockAchievement(achievementId: string) {
      if (!this.currentPlayer) return
      const achievement = this.currentPlayer.achievements.find((a) => a.id === achievementId)
      if (achievement && achievement.unlockedAt === null) {
        achievement.unlockedAt = new Date().toISOString()
      }
    },

    setAvatar(url: string) {
      if (!this.currentPlayer) return
      this.currentPlayer.avatarUrl = url
    },

    $reset() {
      this.currentPlayer = null
      this.isLoading = false
    },
  },
})

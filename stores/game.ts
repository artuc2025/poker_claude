import { defineStore } from 'pinia'
import type { GameState, GamePhase, PlayerAction, SeatState, Card, ActionRecord } from '@/types/game'

const EMPTY_SEATS = 9

function createInitialState(): GameState {
  return {
    id: '',
    phase: 'waiting',
    pot: 0,
    sidePots: [],
    communityCards: [],
    deck: [],
    seats: Array(EMPTY_SEATS).fill(null) as (SeatState | null)[],
    currentSeatIndex: -1,
    dealerSeatIndex: 0,
    smallBlind: 10,
    bigBlind: 20,
    roundHistory: [],
    isRunning: false,
  }
}

export const useGameStore = defineStore('game', {
  state: (): GameState => createInitialState(),

  getters: {
    activeSeat(state): SeatState | null {
      if (state.currentSeatIndex < 0) return null
      return state.seats[state.currentSeatIndex] ?? null
    },

    heroSeat(state): SeatState | null {
      return state.seats.find((s) => s?.isHero) ?? null
    },

    occupiedSeats(state): SeatState[] {
      return state.seats.filter((s): s is SeatState => s !== null)
    },

    flopCards(state): Card[] {
      return state.communityCards.slice(0, 3)
    },

    turnCard(state): Card | null {
      return state.communityCards[3] ?? null
    },

    riverCard(state): Card | null {
      return state.communityCards[4] ?? null
    },

    totalPot(state): number {
      const sidePotTotal = state.sidePots.reduce((sum, sp) => sum + sp.amount, 0)
      return state.pot + sidePotTotal
    },
  },

  actions: {
    setPhase(phase: GamePhase) {
      this.phase = phase
    },

    recordAction(action: PlayerAction, seatIndex: number, amount?: number) {
      const record: ActionRecord = {
        seatIndex,
        action,
        amount,
        phase: this.phase,
        timestamp: Date.now(),
      }
      this.roundHistory.push(record)

      const seat = this.seats[seatIndex]
      if (!seat) return

      if (action === 'fold') {
        seat.status = 'folded'
      } else if (action === 'all-in') {
        seat.status = 'all-in'
      }
    },

    addToPot(amount: number) {
      this.pot += amount
    },

    revealCommunityCard(card: Card) {
      if (this.communityCards.length < 5) {
        this.communityCards.push(card)
      }
    },

    advanceCurrentSeat() {
      const total = this.seats.length
      let next = (this.currentSeatIndex + 1) % total
      let tries = 0
      while (tries < total) {
        const seat = this.seats[next]
        if (seat && seat.status === 'active') {
          this.currentSeatIndex = next
          return
        }
        next = (next + 1) % total
        tries++
      }
    },

    resetRound() {
      this.pot = 0
      this.sidePots = []
      this.communityCards = []
      this.roundHistory = []
      this.phase = 'waiting'
      for (const seat of this.seats) {
        if (seat) {
          seat.currentBet = 0
          seat.holeCards = []
          if (seat.status !== 'sitting-out') {
            seat.status = 'active'
          }
        }
      }
    },

    $reset() {
      Object.assign(this, createInitialState())
    },
  },
})

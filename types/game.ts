export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'

export interface Card {
  suit: Suit
  rank: Rank
  id: string // e.g. 'hearts-A', 'spades-10'
}

export type GamePhase = 'waiting' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown'

export type PlayerAction = 'fold' | 'check' | 'call' | 'raise' | 'all-in'

export type SeatStatus = 'active' | 'folded' | 'all-in' | 'sitting-out' | 'empty'

export interface SidePot {
  amount: number
  eligibleSeatIndices: number[]
}

export interface SeatState {
  playerId: string
  seatIndex: number
  stackSize: number
  currentBet: number
  status: SeatStatus
  holeCards: Card[]
  isHero: boolean
}

export interface ActionRecord {
  seatIndex: number
  action: PlayerAction
  amount?: number
  phase: GamePhase
  timestamp: number
}

export interface GameState {
  id: string
  phase: GamePhase
  pot: number
  sidePots: SidePot[]
  communityCards: Card[]
  deck: Card[]
  seats: (SeatState | null)[]
  currentSeatIndex: number
  dealerSeatIndex: number
  smallBlind: number
  bigBlind: number
  roundHistory: ActionRecord[]
  isRunning: boolean
}

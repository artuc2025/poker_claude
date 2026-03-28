export type TournamentStatus = 'registering' | 'running' | 'final-table' | 'finished' | 'cancelled'
export type TournamentType = 'freezeout' | 'rebuy' | 'bounty' | 'satellite'

export interface BlindLevel {
  level: number
  smallBlind: number
  bigBlind: number
  ante: number
  durationMinutes: number
}

export interface PrizeEntry {
  place: number
  percentage: number  // of total prize pool
  amount: number
}

export interface TournamentStanding {
  place: number
  playerId: string
  playerName: string
  chipCount: number
  isEliminated: boolean
}

export interface Tournament {
  id: string
  name: string
  type: TournamentType
  status: TournamentStatus
  buyIn: number
  prizePool: number
  registeredCount: number
  maxPlayers: number
  startTime: string       // ISO string
  blindSchedule: BlindLevel[]
  prizeStructure: PrizeEntry[]
  standings: TournamentStanding[]
  currentLevel: number
  nextLevelIn: number     // seconds
}

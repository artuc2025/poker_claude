export type PlayerLevel = 'beginner' | 'amateur' | 'regular' | 'shark' | 'pro'

export interface PlayerStats {
  handsPlayed: number
  handsWon: number
  winRate: number       // percentage 0-100
  totalProfit: number
  biggestPot: number
  vpip: number          // voluntarily put in pot %
  pfr: number           // pre-flop raise %
}

export interface HandHistoryEntry {
  id: string
  tableId: string
  tableName: string
  date: string          // ISO string
  phase: string         // last phase reached
  heroCards: string[]   // e.g. ['hearts-A', 'spades-K']
  communityCards: string[]
  result: number        // positive = win, negative = loss
  action: string        // 'won' | 'lost' | 'folded'
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string | null // ISO string or null if locked
}

export interface Player {
  id: string
  name: string
  avatarUrl: string | null
  level: PlayerLevel
  bankroll: number
  stats: PlayerStats
  handHistory: HandHistoryEntry[]
  achievements: Achievement[]
  isOnline: boolean
  country: string
}

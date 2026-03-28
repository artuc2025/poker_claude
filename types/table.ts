export type TableType = 'cash' | 'sit-n-go' | 'tournament'
export type TableSpeed = 'normal' | 'fast' | 'turbo'
export type TableStatus = 'waiting' | 'running' | 'full' | 'closed'

export interface Stakes {
  smallBlind: number
  bigBlind: number
}

export interface TableConfig {
  maxPlayers: number      // 2, 6, 9
  type: TableType
  speed: TableSpeed
  stakes: Stakes
  minBuyIn: number
  maxBuyIn: number
}

export interface Table {
  id: string
  name: string
  config: TableConfig
  status: TableStatus
  playersCount: number
  averagePot: number
  handsPerHour: number
  waitingCount: number    // players in waiting list
}

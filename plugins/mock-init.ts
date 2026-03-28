// Initialises Pinia stores with mock data on app startup.
// This replaces future API calls during the current mock-data phase.
import { useLobbyStore } from '@/stores/lobby'
import { usePlayerStore } from '@/stores/player'
import { MOCK_TABLES } from '@/data/mock/tables'
import { MOCK_HERO } from '@/data/mock/players'

export default defineNuxtPlugin(() => {
  const lobbyStore  = useLobbyStore()
  const playerStore = usePlayerStore()

  lobbyStore.setTables(MOCK_TABLES)
  playerStore.setCurrentPlayer(MOCK_HERO)
})

<script setup lang="ts">
import { useTournamentStore } from '@/stores/tournament'
import { useUiStore } from '@/stores/ui'

definePageMeta({ layout: 'default' })

const route = useRoute()
const tournamentStore = useTournamentStore()
const uiStore = useUiStore()

const tournamentId = computed(() => route.params.id as string)

onMounted(() => {
  tournamentStore.setCurrentTournament(tournamentId.value)

  if (!tournamentStore.currentTournament) {
    uiStore.showToast('Tournament not found', 'error')
    navigateTo('/tournament')
  }
})

onUnmounted(() => {
  tournamentStore.setCurrentTournament(null)
})

const t = computed(() => tournamentStore.currentTournament)

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <div class="tournament-page">
    <template v-if="t">
      <div class="tournament-page__header">
        <NuxtLink to="/tournament" class="tournament-page__back">← Tournaments</NuxtLink>
        <h1 class="tournament-page__title">{{ t.name }}</h1>
      </div>

      <div class="tournament-page__grid">
        <div class="tournament-page__card">
          <h2 class="tournament-page__section-title">Info</h2>
          <ul class="tournament-page__info-list">
            <li>Buy-in: <strong>${{ t.buyIn || 'Free' }}</strong></li>
            <li>Prize pool: <strong>${{ t.prizePool.toLocaleString() }}</strong></li>
            <li>Players: <strong>{{ t.registeredCount }}/{{ t.maxPlayers }}</strong></li>
            <li>Start: <strong>{{ formatDate(t.startTime) }}</strong></li>
            <li>Type: <strong>{{ t.type }}</strong></li>
            <li>Status: <strong>{{ t.status }}</strong></li>
          </ul>
          <p class="tournament-page__placeholder">
            TournamentLobby component — coming in P5-T03
          </p>
        </div>

        <div class="tournament-page__card">
          <h2 class="tournament-page__section-title">
            Blind Schedule
          </h2>
          <p class="tournament-page__placeholder">
            BlindSchedule component — coming in P5-T04
          </p>
          <table class="tournament-page__blinds">
            <thead>
              <tr>
                <th>Level</th>
                <th>Blinds</th>
                <th>Ante</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="level in t.blindSchedule"
                :key="level.level"
                :class="{ 'tournament-page__blinds-row--active': level.level === t.currentLevel }"
              >
                <td>{{ level.level }}</td>
                <td>{{ level.smallBlind }}/{{ level.bigBlind }}</td>
                <td>{{ level.ante || '—' }}</td>
                <td>{{ level.durationMinutes }}m</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="t.standings.length" class="tournament-page__card">
          <h2 class="tournament-page__section-title">Standings</h2>
          <ul class="tournament-page__standings">
            <li
              v-for="s in t.standings"
              :key="s.playerId"
              class="tournament-page__standing"
              :class="{ 'tournament-page__standing--eliminated': s.isEliminated }"
            >
              <span class="tournament-page__place">#{{ s.place }}</span>
              <span class="tournament-page__player-name">{{ s.playerName }}</span>
              <span class="tournament-page__chips">{{ s.chipCount.toLocaleString() }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>

    <div v-else class="tournament-page__loading">
      <p>Loading tournament...</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tournament-page {
  padding: $spacing-6;

  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-4;
    margin-bottom: $spacing-6;
  }

  &__back {
    color: $color-text-secondary;
    text-decoration: none;
    font-size: $font-size-sm;
    transition: color $transition-fast;
    white-space: nowrap;

    &:hover { color: $color-text-primary; }
  }

  &__title {
    font-family: $font-display;
    font-size: $font-size-2xl;
    color: $color-text-primary;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: $spacing-4;
  }

  &__card {
    background: $color-bg-secondary;
    border-radius: $border-radius-md;
    border: 1px solid $color-border-primary;
    padding: $spacing-5;
  }

  &__section-title {
    font-family: $font-display;
    font-size: $font-size-lg;
    color: $color-text-primary;
    margin-bottom: $spacing-4;
  }

  &__info-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin-bottom: $spacing-4;

    strong { color: $color-text-primary; }
  }

  &__placeholder {
    font-size: $font-size-xs;
    color: $color-text-secondary;
    margin-bottom: $spacing-3;
  }

  &__blinds {
    width: 100%;
    border-collapse: collapse;
    font-family: $font-mono;
    font-size: $font-size-xs;

    th, td {
      text-align: left;
      padding: $spacing-1 $spacing-2;
      color: $color-text-secondary;
    }

    th { color: $color-text-primary; font-weight: 600; }

    &-row--active td {
      color: $color-accent-gold;
      font-weight: 600;
    }
  }

  &__standings {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
  }

  &__standing {
    @include flex-between;
    font-size: $font-size-sm;
    padding: $spacing-2 0;
    border-bottom: 1px solid $color-border-primary;

    &--eliminated {
      opacity: 0.4;
      text-decoration: line-through;
    }
  }

  &__place {
    font-family: $font-mono;
    color: $color-text-secondary;
    width: 32px;
  }

  &__player-name { color: $color-text-primary; flex: 1; padding: 0 $spacing-3; }

  &__chips {
    font-family: $font-mono;
    color: $color-accent-gold;
  }

  &__loading {
    @include flex-center;
    min-height: 400px;
    color: $color-text-secondary;
  }
}
</style>

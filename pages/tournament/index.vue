<script setup lang="ts">
import { useTournamentStore } from '@/stores/tournament'
import { MOCK_TOURNAMENTS } from '@/data/mock/tournaments'

definePageMeta({ layout: 'default' })

const tournamentStore = useTournamentStore()

onMounted(() => {
  tournamentStore.setTournaments(MOCK_TOURNAMENTS)
})

const statusLabel: Record<string, string> = {
  registering: 'Registering',
  running: 'Running',
  'final-table': 'Final Table',
  finished: 'Finished',
  cancelled: 'Cancelled',
}

const statusColor: Record<string, string> = {
  registering: 'green',
  running: 'gold',
  'final-table': 'gold',
  finished: 'muted',
  cancelled: 'red',
}
</script>

<template>
  <div class="tournaments-page">
    <div class="tournaments-page__header">
      <h1 class="tournaments-page__title">Tournaments</h1>
      <span class="tournaments-page__count">
        {{ tournamentStore.filteredTournaments.length }} tournaments
      </span>
    </div>

    <p class="tournaments-page__placeholder">
      Tournament cards — coming in P5-T02
    </p>

    <div class="tournaments-page__list">
      <NuxtLink
        v-for="t in tournamentStore.filteredTournaments"
        :key="t.id"
        :to="`/tournament/${t.id}`"
        class="tournaments-page__item"
      >
        <div class="tournaments-page__item-header">
          <span class="tournaments-page__name">{{ t.name }}</span>
          <span
            class="tournaments-page__status"
            :class="`tournaments-page__status--${statusColor[t.status]}`"
          >
            {{ statusLabel[t.status] }}
          </span>
        </div>
        <div class="tournaments-page__item-meta">
          <span>Buy-in: ${{ t.buyIn }}</span>
          <span>Prize: ${{ t.prizePool.toLocaleString() }}</span>
          <span>{{ t.registeredCount }}/{{ t.maxPlayers }} players</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tournaments-page {
  padding: $spacing-6;

  &__header {
    @include flex-between;
    margin-bottom: $spacing-6;
  }

  &__title {
    font-family: $font-display;
    font-size: $font-size-3xl;
    color: var(--color-text-primary);
  }

  &__count {
    font-size: $font-size-sm;
    color: var(--color-text-secondary);
  }

  &__placeholder {
    font-size: $font-size-sm;
    color: var(--color-text-secondary);
    margin-bottom: $spacing-4;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
  }

  &__item {
    background: var(--color-bg-secondary);
    border-radius: $border-radius-md;
    border: 1px solid var(--color-border-primary);
    padding: $spacing-4;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
    transition: background $transition-fast;

    &:hover {
      background: var(--color-bg-tertiary);
    }
  }

  &__item-header {
    @include flex-between;
  }

  &__name {
    color: var(--color-text-primary);
    font-weight: 500;
  }

  &__status {
    font-size: $font-size-xs;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &--green  { color: $color-accent-green; }
    &--gold   { color: $color-accent-gold; }
    &--red    { color: $color-accent-red; }
    &--muted  { color: var(--color-text-secondary); }
  }

  &__item-meta {
    display: flex;
    gap: $spacing-4;
    font-family: $font-mono;
    font-size: $font-size-xs;
    color: var(--color-text-secondary);
  }
}
</style>

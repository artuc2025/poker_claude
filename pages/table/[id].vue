<script setup lang="ts">
import { useLobbyStore } from '@/stores/lobby'
import { useGameStore } from '@/stores/game'
import { useUiStore } from '@/stores/ui'

definePageMeta({ layout: 'default' })

const route = useRoute()
const lobbyStore = useLobbyStore()
const gameStore = useGameStore()
const uiStore = useUiStore()

const tableId = computed(() => route.params.id as string)

const table = computed(() =>
  lobbyStore.tables.find((t) => t.id === tableId.value) ?? null
)

onMounted(() => {
  if (!table.value) {
    uiStore.showToast('Table not found', 'error')
    navigateTo('/')
  } else {
    lobbyStore.addActiveTable(tableId.value)
  }
})

onUnmounted(() => {
  lobbyStore.removeActiveTable(tableId.value)
  gameStore.$reset()
})
</script>

<template>
  <div class="table-page">
    <template v-if="table">
      <div class="table-page__header">
        <NuxtLink to="/" class="table-page__back">← Lobby</NuxtLink>
        <h1 class="table-page__title">{{ table.name }}</h1>
        <span class="table-page__meta">
          ${{ table.config.stakes.smallBlind }}/${{ table.config.stakes.bigBlind }} ·
          {{ table.config.type }} · {{ table.config.speed }}
        </span>
      </div>

      <div class="table-page__felt">
        <p class="table-page__placeholder">
          Game Table — coming in P2-T01
        </p>
        <div class="table-page__info">
          <span>Players: {{ table.playersCount }}/{{ table.config.maxPlayers }}</span>
          <span>Avg pot: ${{ table.averagePot }}</span>
          <span>Hands/hr: {{ table.handsPerHour }}</span>
        </div>
      </div>
    </template>

    <div v-else class="table-page__loading">
      <p>Loading table...</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-page {
  padding: $spacing-6;

  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-4;
    margin-bottom: $spacing-6;
  }

  &__back {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: $font-size-sm;
    transition: color $transition-fast;

    &:hover {
      color: var(--color-text-primary);
    }
  }

  &__title {
    font-family: $font-display;
    font-size: $font-size-2xl;
    color: var(--color-text-primary);
  }

  &__meta {
    font-size: $font-size-sm;
    color: var(--color-text-secondary);
    font-family: $font-mono;
    margin-left: auto;
  }

  &__felt {
    @include flex-center;
    flex-direction: column;
    gap: $spacing-6;
    min-height: 480px;
    background: $color-bg-table;
    border-radius: $border-radius-xl;
    border: 4px solid color-mix(in srgb, $color-bg-table-felt 60%, transparent);
    box-shadow: var(--shadow-xl);
  }

  &__placeholder {
    color: var(--color-text-secondary);
    font-size: $font-size-lg;
  }

  &__info {
    display: flex;
    gap: $spacing-6;
    font-family: $font-mono;
    font-size: $font-size-sm;
    color: $color-accent-gold;
  }

  &__loading {
    @include flex-center;
    min-height: 400px;
    color: var(--color-text-secondary);
  }
}
</style>

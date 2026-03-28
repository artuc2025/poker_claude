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

      <div class="table-page__canvas">
        <GameTable :table="table" />
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

  &__canvas {
    @include flex-center;
    padding: $spacing-6 $spacing-4;
    overflow-x: auto;
  }

  &__loading {
    @include flex-center;
    min-height: 400px;
    color: var(--color-text-secondary);
  }
}
</style>

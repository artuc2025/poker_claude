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

const canvasRef = ref<HTMLElement | null>(null)
const { scale } = useTableScale(canvasRef)

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

      <div ref="canvasRef" class="table-page__canvas">
        <div :style="{ zoom: scale }">
          <GameTable :table="table" />
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
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: $spacing-6 $spacing-6 0;

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
    flex: 1;
    min-height: 0;
    padding: $spacing-4;
    overflow: hidden;
  }

  &__loading {
    @include flex-center;
    min-height: 400px;
    color: var(--color-text-secondary);
  }
}
</style>

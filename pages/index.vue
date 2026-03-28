<script setup lang="ts">
import { useLobbyStore } from '@/stores/lobby'
import { usePlayerStore } from '@/stores/player'
import { MOCK_TABLES } from '@/data/mock/tables'
import { MOCK_HERO, MOCK_PLAYERS } from '@/data/mock/players'
import { MOCK_HAND_HISTORY } from '@/data/mock/hands'

definePageMeta({ layout: 'default' })

const lobbyStore = useLobbyStore()
const playerStore = usePlayerStore()

onMounted(() => {
  lobbyStore.setTables(MOCK_TABLES)
  lobbyStore.setOnlineCount(1247)

  if (!playerStore.isLoggedIn) {
    playerStore.setPlayer({ ...MOCK_HERO, handHistory: MOCK_HAND_HISTORY })
    playerStore.setPlayers(MOCK_PLAYERS)
  }
})
</script>

<template>
  <div class="lobby-page">
    <div class="lobby-page__header">
      <h1 class="lobby-page__title">Lobby</h1>
      <span class="lobby-page__online">
        {{ lobbyStore.filteredTables.length }} tables available
      </span>
    </div>

    <div class="lobby-page__placeholder">
      <p>Table list — coming in P3-T02</p>
      <ul class="lobby-page__list">
        <li
          v-for="table in lobbyStore.filteredTables"
          :key="table.id"
          class="lobby-page__item"
        >
          <NuxtLink :to="`/table/${table.id}`" class="lobby-page__link">
            <span class="lobby-page__name">{{ table.name }}</span>
            <span class="lobby-page__meta">
              ${{ table.config.stakes.bigBlind }} BB ·
              {{ table.playersCount }}/{{ table.config.maxPlayers }} players
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lobby-page {
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

  &__online {
    font-size: $font-size-sm;
    color: var(--color-text-secondary);
  }

  &__placeholder {
    color: var(--color-text-secondary);
    font-size: $font-size-sm;
    margin-bottom: $spacing-4;
  }

  &__list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
    margin-top: $spacing-4;
  }

  &__item {
    background: var(--color-bg-secondary);
    border-radius: $border-radius-md;
    border: 1px solid var(--color-border-primary);
  }

  &__link {
    @include flex-between;
    padding: $spacing-3 $spacing-4;
    text-decoration: none;
    transition: background $transition-fast;

    &:hover {
      background: var(--color-bg-tertiary);
    }
  }

  &__name {
    color: var(--color-text-primary);
    font-weight: 500;
  }

  &__meta {
    font-size: $font-size-sm;
    color: var(--color-text-secondary);
    font-family: $font-mono;
  }
}
</style>

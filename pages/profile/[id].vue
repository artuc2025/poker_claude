<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { MOCK_PLAYERS, MOCK_HERO } from '@/data/mock/players'
import { MOCK_HAND_HISTORY } from '@/data/mock/hands'
import type { Player } from '@/types/player'

definePageMeta({ layout: 'default' })

const route = useRoute()
const playerStore = usePlayerStore()

const profileId = computed(() => route.params.id as string)

const profile = computed<Player | null>(() => {
  if (profileId.value === 'me' || profileId.value === MOCK_HERO.id) {
    return playerStore.currentPlayer
  }
  return MOCK_PLAYERS.find((p) => p.id === profileId.value) ?? null
})

const isHero = computed(() =>
  profile.value?.id === MOCK_HERO.id || profileId.value === 'me'
)

const handHistory = computed(() =>
  isHero.value ? MOCK_HAND_HISTORY : []
)

onMounted(() => {
  if (isHero.value && !playerStore.isLoggedIn) {
    playerStore.setPlayer({ ...MOCK_HERO, handHistory: MOCK_HAND_HISTORY })
  }
})

function formatResult(result: number): string {
  return result >= 0 ? `+$${result}` : `-$${Math.abs(result)}`
}
</script>

<template>
  <div class="profile-page">
    <template v-if="profile">
      <div class="profile-page__header">
        <NuxtLink to="/" class="profile-page__back">← Lobby</NuxtLink>
        <div class="profile-page__identity">
          <div class="profile-page__avatar">
            {{ profile.name.slice(0, 2).toUpperCase() }}
          </div>
          <div>
            <h1 class="profile-page__name">{{ profile.name }}</h1>
            <span class="profile-page__level">{{ profile.level }}</span>
          </div>
        </div>
      </div>

      <div class="profile-page__grid">
        <div class="profile-page__card">
          <h2 class="profile-page__section-title">Stats</h2>
          <p class="profile-page__placeholder">
            StatsOverview — coming in P4-T02
          </p>
          <ul class="profile-page__stats">
            <li>Hands played: <strong>{{ profile.stats.handsPlayed.toLocaleString() }}</strong></li>
            <li>Win rate: <strong>{{ profile.stats.winRate }}%</strong></li>
            <li>Total profit: <strong :class="profile.stats.totalProfit >= 0 ? 'profile-page__positive' : 'profile-page__negative'">
              {{ formatResult(profile.stats.totalProfit) }}
            </strong></li>
            <li>Biggest pot: <strong>${{ profile.stats.biggestPot.toLocaleString() }}</strong></li>
            <li>VPIP: <strong>{{ profile.stats.vpip }}%</strong></li>
            <li>PFR: <strong>{{ profile.stats.pfr }}%</strong></li>
          </ul>
        </div>

        <div v-if="isHero" class="profile-page__card">
          <h2 class="profile-page__section-title">Bankroll</h2>
          <p class="profile-page__bankroll">${{ profile.bankroll.toLocaleString() }}</p>
        </div>

        <div class="profile-page__card profile-page__card--wide">
          <h2 class="profile-page__section-title">Achievements</h2>
          <p class="profile-page__placeholder">
            AchievementBadge — coming in P4-T06
          </p>
          <div class="profile-page__achievements">
            <div
              v-for="a in profile.achievements"
              :key="a.id"
              class="profile-page__achievement"
              :class="{ 'profile-page__achievement--locked': !a.unlockedAt }"
            >
              <span class="profile-page__achievement-icon">{{ a.icon }}</span>
              <span class="profile-page__achievement-title">{{ a.title }}</span>
            </div>
          </div>
        </div>

        <div v-if="isHero && handHistory.length" class="profile-page__card profile-page__card--wide">
          <h2 class="profile-page__section-title">Hand History</h2>
          <p class="profile-page__placeholder">
            HandHistory component — coming in P4-T04
          </p>
          <ul class="profile-page__hands">
            <li
              v-for="hand in handHistory"
              :key="hand.id"
              class="profile-page__hand"
            >
              <span class="profile-page__hand-table">{{ hand.tableName }}</span>
              <span class="profile-page__hand-cards">
                {{ hand.heroCards.join(' · ') }}
              </span>
              <span
                class="profile-page__hand-result"
                :class="hand.result >= 0 ? 'profile-page__positive' : 'profile-page__negative'"
              >
                {{ formatResult(hand.result) }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </template>

    <div v-else class="profile-page__not-found">
      <p>Player not found.</p>
      <NuxtLink to="/">Back to Lobby</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-page {
  padding: $spacing-6;

  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-6;
    margin-bottom: $spacing-6;
  }

  &__back {
    color: $color-text-secondary;
    text-decoration: none;
    font-size: $font-size-sm;
    white-space: nowrap;
    transition: color $transition-fast;

    &:hover { color: $color-text-primary; }
  }

  &__identity {
    display: flex;
    align-items: center;
    gap: $spacing-4;
  }

  &__avatar {
    @include flex-center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: $color-accent-gold;
    color: $color-bg-primary;
    font-family: $font-display;
    font-size: $font-size-xl;
    font-weight: 700;
    flex-shrink: 0;
  }

  &__name {
    font-family: $font-display;
    font-size: $font-size-2xl;
    color: $color-text-primary;
  }

  &__level {
    font-size: $font-size-sm;
    color: $color-accent-gold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: $spacing-4;
  }

  &__card {
    background: $color-bg-secondary;
    border-radius: $border-radius-md;
    border: 1px solid $color-border-primary;
    padding: $spacing-5;

    &--wide {
      grid-column: 1 / -1;
    }
  }

  &__section-title {
    font-family: $font-display;
    font-size: $font-size-lg;
    color: $color-text-primary;
    margin-bottom: $spacing-4;
  }

  &__placeholder {
    font-size: $font-size-xs;
    color: $color-text-secondary;
    margin-bottom: $spacing-3;
  }

  &__stats {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
    font-size: $font-size-sm;
    color: $color-text-secondary;

    strong { color: $color-text-primary; }
  }

  &__bankroll {
    font-family: $font-display;
    font-size: $font-size-3xl;
    color: $color-accent-gold;
  }

  &__achievements {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-3;
  }

  &__achievement {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    padding: $spacing-2 $spacing-3;
    background: $color-bg-tertiary;
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    color: $color-text-primary;

    &--locked {
      opacity: 0.35;
      filter: grayscale(1);
    }
  }

  &__achievement-icon { font-size: $font-size-lg; }

  &__hands {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
  }

  &__hand {
    @include flex-between;
    padding: $spacing-2 0;
    border-bottom: 1px solid $color-border-primary;
    font-size: $font-size-sm;
  }

  &__hand-table { color: $color-text-secondary; flex: 1; }

  &__hand-cards {
    font-family: $font-mono;
    font-size: $font-size-xs;
    color: $color-text-secondary;
    flex: 2;
    padding: 0 $spacing-3;
  }

  &__hand-result {
    font-family: $font-mono;
    font-weight: 600;
  }

  &__positive { color: $color-accent-green; }
  &__negative { color: $color-accent-red; }

  &__not-found {
    @include flex-center;
    flex-direction: column;
    gap: $spacing-4;
    min-height: 400px;
    color: $color-text-secondary;

    a {
      color: $color-accent-blue;
      text-decoration: none;
    }
  }
}
</style>

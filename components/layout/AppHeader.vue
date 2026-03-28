<script setup lang="ts">
// 1. Imports
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import { usePlayerStore } from '@/stores/player'
import { useUiStore } from '@/stores/ui'

// 2. Stores
const playerStore = usePlayerStore()
const uiStore = useUiStore()

const hero = computed(() => ({
  name: playerStore.currentPlayer?.name ?? 'Guest',
  bankroll: playerStore.bankroll,
  avatar: playerStore.currentPlayer?.avatarUrl ?? '',
  level: playerStore.currentPlayer?.level ?? 'beginner',
}))

// 3. Nav links
const navLinks = [
  { label: 'Лобби',     to: '/',                  icon: 'M3 12l9-9 9 9M5 10v9h5v-5h4v5h5v-9' },
  { label: 'Турниры',   to: '/tournament',         icon: 'M8 21h8M12 17v4M4 3h16v10a4 4 0 01-4 4H8a4 4 0 01-4-4V3z' },
  { label: 'Профиль',   to: '/profile/me',         icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
]

const route = useRoute()

const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)

// 4. Bankroll formatter
const formatBankroll = (val: number) =>
  val >= 1_000 ? `$${(val / 1_000).toFixed(1)}k` : `$${val}`
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">

      <!-- Logo -->
      <NuxtLink to="/" class="app-header__logo">
        <span class="app-header__logo-icon">♠</span>
        <span class="app-header__logo-text">PokerArena</span>
      </NuxtLink>

      <!-- Nav -->
      <nav class="app-header__nav" aria-label="Главная навигация">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="['app-header__nav-link', { 'app-header__nav-link--active': isActive(link.to) }]"
        >
          <svg class="app-header__nav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path :d="link.icon" />
          </svg>
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Right side -->
      <div class="app-header__right">
        <!-- Bankroll -->
        <div class="app-header__bankroll">
          <span class="app-header__bankroll-label">Баланс</span>
          <span class="app-header__bankroll-value">{{ formatBankroll(hero.bankroll) }}</span>
        </div>

        <!-- Deposit button -->
        <button class="app-header__deposit" aria-label="Пополнить">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>

        <!-- Theme toggle -->
        <button
          class="app-header__theme-toggle"
          :aria-label="uiStore.isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="uiStore.toggleTheme()"
        >
          <svg v-if="uiStore.isDark" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        <!-- Level badge -->
        <BaseBadge variant="gold" size="sm">{{ hero.level }}</BaseBadge>

        <!-- Avatar -->
        <BaseAvatar
          :name="hero.name"
          :src="hero.avatar"
          size="sm"
          :online="true"
        />
      </div>

    </div>
  </header>
</template>

<style lang="scss" scoped>
$header-height: 56px;

.app-header {
  position: sticky;
  top: 0;
  z-index: $z-index-header;
  height: $header-height;

  background: color-mix(in srgb, $color-bg-secondary 95%, transparent);
  border-bottom: 1px solid $color-border;
  backdrop-filter: blur(12px);

  &__inner {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    height: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 $spacing-lg;
  }

  // --- Logo ---
  &__logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    flex-shrink: 0;

    &-icon {
      font-size: 22px;
      color: $color-accent-gold;
      line-height: 1;
    }

    &-text {
      font-family: $font-display;
      font-size: 20px;
      letter-spacing: 0.08em;
      color: $color-text-primary;
    }
  }

  // --- Nav ---
  &__nav {
    display: flex;
    align-items: center;
    gap: 2px;
    flex: 1;
  }

  &__nav-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: $border-radius-md;
    font-family: $font-body;
    font-size: 13px;
    font-weight: 500;
    color: $color-text-secondary;
    text-decoration: none;
    transition: background $transition-fast, color $transition-fast;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: $color-text-primary;
    }

    &--active {
      background: rgba($color-accent-gold, 0.12);
      color: $color-accent-gold;
    }
  }

  &__nav-icon {
    flex-shrink: 0;
    opacity: 0.8;
  }

  // --- Right ---
  &__right {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-left: auto;
  }

  &__bankroll {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.1;

    &-label {
      font-size: 10px;
      color: $color-text-secondary;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    &-value {
      font-family: $font-mono;
      font-size: 14px;
      font-weight: 600;
      color: $color-accent-gold;
    }
  }

  &__theme-toggle {
    @include flex-center;
    width: 28px;
    height: 28px;
    border: 1px solid $color-border;
    border-radius: $border-radius-sm;
    background: transparent;
    color: $color-text-secondary;
    cursor: pointer;
    transition: background $transition-fast, color $transition-fast, border-color $transition-fast;

    &:hover {
      background: rgba($color-accent-gold, 0.1);
      border-color: $color-accent-gold;
      color: $color-accent-gold;
    }
  }

  &__deposit {
    @include flex-center;
    width: 28px;
    height: 28px;
    border: 1px solid $color-border;
    border-radius: $border-radius-sm;
    background: transparent;
    color: $color-text-secondary;
    cursor: pointer;
    transition: background $transition-fast, color $transition-fast, border-color $transition-fast;

    &:hover {
      background: rgba($color-accent-gold, 0.1);
      border-color: $color-accent-gold;
      color: $color-accent-gold;
    }
  }
}
</style>

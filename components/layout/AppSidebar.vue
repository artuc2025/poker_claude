<script setup lang="ts">
// Collapsible sidebar with quick navigation and active tables list

// 1. Props
const props = withDefaults(defineProps<{
  collapsed?: boolean
}>(), {
  collapsed: false,
})

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

// 2. Nav sections
const mainLinks = [
  { label: 'Лобби',     to: '/',               icon: 'M3 12l9-9 9 9M5 10v9h5v-5h4v5h5v-9' },
  { label: 'Турниры',   to: '/tournament',      icon: 'M8 21h8M12 17v4M4 3h16v10a4 4 0 01-4 4H8a4 4 0 01-4-4V3z' },
  { label: 'Профиль',   to: '/profile/me',      icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
]

// Mock active tables (будет из stores/lobby.ts)
const activeTables = [
  { id: '1', name: 'NL100 — Стол 4', players: 6 },
  { id: '2', name: 'NL25 — Стол 11', players: 4 },
]

const route = useRoute()
const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)

function toggle() {
  emit('update:collapsed', !props.collapsed)
}
</script>

<template>
  <aside :class="['app-sidebar', { 'app-sidebar--collapsed': collapsed }]">

    <!-- Toggle button -->
    <button class="app-sidebar__toggle" :aria-label="collapsed ? 'Развернуть' : 'Свернуть'" @click="toggle">
      <svg
        class="app-sidebar__toggle-icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>

    <!-- Main navigation -->
    <nav class="app-sidebar__nav" aria-label="Боковая навигация">
      <NuxtLink
        v-for="link in mainLinks"
        :key="link.to"
        :to="link.to"
        :class="['app-sidebar__link', { 'app-sidebar__link--active': isActive(link.to) }]"
        :title="collapsed ? link.label : undefined"
      >
        <svg class="app-sidebar__link-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path :d="link.icon" />
        </svg>
        <Transition name="sidebar-label">
          <span v-if="!collapsed" class="app-sidebar__link-label">{{ link.label }}</span>
        </Transition>
      </NuxtLink>
    </nav>

    <!-- Divider -->
    <div class="app-sidebar__divider" />

    <!-- Active tables -->
    <div v-if="activeTables.length" class="app-sidebar__section">
      <Transition name="sidebar-label">
        <span v-if="!collapsed" class="app-sidebar__section-title">Мои столы</span>
      </Transition>

      <NuxtLink
        v-for="table in activeTables"
        :key="table.id"
        :to="`/table/${table.id}`"
        class="app-sidebar__table-link"
        :title="collapsed ? table.name : undefined"
      >
        <span class="app-sidebar__table-dot" />
        <Transition name="sidebar-label">
          <div v-if="!collapsed" class="app-sidebar__table-info">
            <span class="app-sidebar__table-name">{{ table.name }}</span>
            <span class="app-sidebar__table-players">{{ table.players }}/9</span>
          </div>
        </Transition>
      </NuxtLink>
    </div>

  </aside>
</template>

<style lang="scss" scoped>
$sidebar-width: 200px;
$sidebar-collapsed-width: 52px;

.app-sidebar {
  display: flex;
  flex-direction: column;
  width: $sidebar-width;
  min-height: 0;
  flex-shrink: 0;

  background: $color-bg-secondary;
  border-right: 1px solid $color-border;
  padding: $spacing-md 0;
  transition: width 0.25s ease;
  overflow: hidden;

  &--collapsed {
    width: $sidebar-collapsed-width;
  }

  // --- Toggle ---
  &__toggle {
    @include flex-center;
    align-self: flex-end;
    width: 28px;
    height: 28px;
    margin: 0 $spacing-sm $spacing-sm;
    border: 1px solid $color-border;
    border-radius: $border-radius-sm;
    background: transparent;
    color: $color-text-secondary;
    cursor: pointer;
    flex-shrink: 0;
    transition: background $transition-fast, color $transition-fast;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: $color-text-primary;
    }
  }

  &__toggle-icon {
    transition: transform $transition-base;
  }

  &--collapsed &__toggle-icon {
    transform: rotate(180deg);
  }

  // --- Nav links ---
  &__nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 $spacing-sm;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: $border-radius-md;
    text-decoration: none;
    color: $color-text-secondary;
    font-family: $font-body;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    transition: background $transition-fast, color $transition-fast;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: $color-text-primary;
    }

    &--active {
      background: rgba($color-accent-gold, 0.12);
      color: $color-accent-gold;

      .app-sidebar__link-icon { opacity: 1; }
    }

    &-icon { flex-shrink: 0; opacity: 0.7; }
    &-label { overflow: hidden; }
  }

  // --- Divider ---
  &__divider {
    height: 1px;
    background: $color-border;
    margin: $spacing-md $spacing-sm;
    flex-shrink: 0;
  }

  // --- Section ---
  &__section {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 $spacing-sm;
  }

  &__section-title {
    font-size: 10px;
    font-weight: 600;
    color: $color-text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0 10px 4px;
    white-space: nowrap;
    overflow: hidden;
  }

  &__table-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border-radius: $border-radius-md;
    text-decoration: none;
    transition: background $transition-fast;

    &:hover { background: rgba(255, 255, 255, 0.06); }
  }

  &__table-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $color-accent-green;
    flex-shrink: 0;
    box-shadow: 0 0 6px rgba($color-accent-green, 0.5);
  }

  &__table-info {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__table-name {
    font-size: 12px;
    color: $color-text-primary;
    font-family: $font-body;
    @include text-ellipsis;
  }

  &__table-players {
    font-size: 10px;
    color: $color-text-secondary;
    font-family: $font-mono;
  }
}

// Label slide transition
.sidebar-label-enter-active,
.sidebar-label-leave-active {
  transition: opacity 0.15s ease, width 0.25s ease;
  overflow: hidden;
}

.sidebar-label-enter-from,
.sidebar-label-leave-to {
  opacity: 0;
  width: 0;
}
</style>

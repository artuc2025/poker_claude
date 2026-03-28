<script setup lang="ts">
const year = new Date().getFullYear()

const links = [
  { label: 'Правила', to: '#' },
  { label: 'Ответственная игра', to: '#' },
  { label: 'Поддержка', to: '#' },
]

// Mock online count (будет из stores/lobby.ts)
const onlineCount = 1_284
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner">

      <span class="app-footer__copy">© {{ year }} PokerArena</span>

      <nav class="app-footer__links" aria-label="Подвал">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.to"
          class="app-footer__link"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="app-footer__online">
        <span class="app-footer__online-dot" />
        <span class="app-footer__online-count">{{ onlineCount.toLocaleString('ru') }} онлайн</span>
      </div>

    </div>
  </footer>
</template>

<style lang="scss" scoped>
.app-footer {
  height: 40px;
  border-top: 1px solid $color-border;
  background: $color-bg-secondary;
  flex-shrink: 0;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 $spacing-lg;
    gap: $spacing-md;
  }

  &__copy {
    font-size: 11px;
    color: $color-text-secondary;
    white-space: nowrap;
    font-family: $font-body;
  }

  &__links {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  &__link {
    font-size: 11px;
    color: $color-text-secondary;
    text-decoration: none;
    font-family: $font-body;
    transition: color $transition-fast;

    &:hover { color: $color-text-primary; }
  }

  &__online {
    display: flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }

  &__online-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: $color-accent-green;
    box-shadow: 0 0 5px rgba($color-accent-green, 0.6);
  }

  &__online-count {
    font-size: 11px;
    font-family: $font-mono;
    color: $color-text-secondary;
  }
}
</style>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { formatStack } from '@/utils/format'

const gameStore = useGameStore()

// Flash animation trigger — fires every time the pot grows
const flashing = ref(false)
let flashTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => gameStore.totalPot,
  (newVal, oldVal) => {
    if (newVal <= oldVal) return
    if (flashTimer) clearTimeout(flashTimer)
    flashing.value = true
    flashTimer = setTimeout(() => { flashing.value = false }, 400)
  },
)

onUnmounted(() => { if (flashTimer) clearTimeout(flashTimer) })
</script>

<template>
  <div class="pot-display">
    <!-- Main pot -->
    <div v-if="gameStore.totalPot > 0" class="pot-display__main">
      <span class="pot-display__label">POT</span>
      <span
        class="pot-display__amount"
        :class="{ 'pot-display__amount--flash': flashing }"
      >
        {{ formatStack(gameStore.totalPot) }}
      </span>
    </div>

    <!-- Side pots -->
    <div
      v-for="(sp, i) in gameStore.sidePots"
      :key="i"
      class="pot-display__side"
    >
      <span class="pot-display__label">SIDE {{ i + 1 }}</span>
      <span class="pot-display__amount pot-display__amount--side">
        {{ formatStack(sp.amount) }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pot-display {
  @include flex-center;
  flex-direction: column;
  gap: $spacing-1;

  &__main {
    @include flex-center;
    gap: $spacing-2;
    padding: $spacing-1 $spacing-3;
    background: rgba(0, 0, 0, 0.35);
    border-radius: $radius-full;
    border: 1px solid rgba($color-accent-gold, 0.25);
    backdrop-filter: blur(4px);
  }

  &__side {
    @include flex-center;
    gap: $spacing-1;
  }

  &__label {
    font-family: $font-display;
    font-size: $font-size-xs;
    color: $color-text-secondary;
    letter-spacing: 0.12em;
  }

  &__amount {
    font-family: $font-display;
    font-size: $font-size-xl;
    color: $color-accent-gold;
    letter-spacing: 0.05em;
    transition: color $transition-fast, text-shadow $transition-fast;

    &--flash {
      color: #fff;
      text-shadow: $shadow-glow-gold;
    }

    &--side {
      font-size: $font-size-sm;
      color: $color-text-secondary;
    }
  }
}
</style>

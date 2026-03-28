<script setup lang="ts">
// 1. Props
withDefaults(defineProps<{
  variant?: 'spinner' | 'dots' | 'skeleton'
  size?: 'sm' | 'md' | 'lg'
  color?: 'gold' | 'white' | 'muted'
  // skeleton-specific
  width?: string
  height?: string
  rounded?: boolean
}>(), {
  variant: 'spinner',
  size: 'md',
  color: 'gold',
  width: '100%',
  height: '16px',
  rounded: false,
})
</script>

<template>
  <!-- Spinner -->
  <div
    v-if="variant === 'spinner'"
    :class="['base-loader', 'base-loader--spinner', `base-loader--${size}`, `base-loader--${color}`]"
    role="status"
    aria-label="Загрузка"
  />

  <!-- Dots -->
  <div
    v-else-if="variant === 'dots'"
    :class="['base-loader', 'base-loader--dots', `base-loader--${size}`, `base-loader--${color}`]"
    role="status"
    aria-label="Загрузка"
  >
    <span class="base-loader__dot" />
    <span class="base-loader__dot" />
    <span class="base-loader__dot" />
  </div>

  <!-- Skeleton -->
  <div
    v-else
    :class="['base-loader', 'base-loader--skeleton', { 'base-loader--skeleton-rounded': rounded }]"
    :style="{ width, height }"
    aria-hidden="true"
  />
</template>

<style lang="scss" scoped>
.base-loader {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  // --- Spinner ---
  &--spinner {
    border-radius: 50%;
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.12);
    animation: loader-spin 0.75s linear infinite;

    // Sizes
    &.base-loader--sm { width: 16px; height: 16px; border-width: 2px; }
    &.base-loader--md { width: 24px; height: 24px; border-width: 2px; }
    &.base-loader--lg { width: 40px; height: 40px; border-width: 3px; }

    // Colors
    &.base-loader--gold  { border-top-color: $color-accent-gold; }
    &.base-loader--white { border-top-color: $color-text-primary; }
    &.base-loader--muted { border-top-color: $color-text-secondary; }
  }

  // --- Dots ---
  &--dots {
    gap: 4px;

    // Sizes
    &.base-loader--sm .base-loader__dot { width: 5px;  height: 5px;  }
    &.base-loader--md .base-loader__dot { width: 7px;  height: 7px;  }
    &.base-loader--lg .base-loader__dot { width: 10px; height: 10px; }

    // Colors
    &.base-loader--gold  .base-loader__dot { background: $color-accent-gold; }
    &.base-loader--white .base-loader__dot { background: $color-text-primary; }
    &.base-loader--muted .base-loader__dot { background: $color-text-secondary; }
  }

  &__dot {
    border-radius: 50%;
    animation: loader-bounce 1.2s ease-in-out infinite;

    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }

  // --- Skeleton ---
  &--skeleton {
    display: block;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.04) 25%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.04) 75%
    );
    background-size: 200% 100%;
    border-radius: $border-radius-sm;
    animation: loader-shimmer 1.5s infinite;

    &-rounded { border-radius: $border-radius-full; }
  }
}

@keyframes loader-spin {
  to { transform: rotate(360deg); }
}

@keyframes loader-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40%            { transform: scale(1);   opacity: 1; }
}

@keyframes loader-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>

<script setup lang="ts">
// 1. Props
const props = withDefaults(defineProps<{
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'gold'
  size?: 'sm' | 'md'
  dot?: boolean       // показывать только точку без текста
  outline?: boolean   // прозрачный фон с цветной рамкой
}>(), {
  variant: 'default',
  size: 'md',
  dot: false,
  outline: false,
})

const classes = computed(() => [
  'base-badge',
  `base-badge--${props.variant}`,
  `base-badge--${props.size}`,
  {
    'base-badge--dot': props.dot,
    'base-badge--outline': props.outline,
  },
])
</script>

<template>
  <span :class="classes">
    <slot v-if="!dot" />
  </span>
</template>

<style lang="scss" scoped>
$badge-colors: (
  'default': var(--color-text-secondary),
  'success': $color-accent-green,
  'error':   $color-accent-red,
  'warning': $color-accent-gold,
  'info':    $color-accent-blue,
  'gold':    $color-accent-gold,
);

.base-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: $font-body;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  border-radius: $border-radius-sm;

  // --- Sizes ---
  &--sm {
    height: 16px;
    padding: 0 5px;
    font-size: 9px;
  }

  &--md {
    height: 20px;
    padding: 0 7px;
    font-size: 10px;
  }

  // --- Dot mode ---
  &--dot {
    width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 50%;
    flex-shrink: 0;
  }

  // --- Variants (solid) ---
  @each $name, $color in $badge-colors {
    &--#{$name} {
      background: rgba($color, 0.18);
      color: $color;
    }
  }

  // 'default' gets a neutral bg override
  &--default {
    background: var(--color-bg-tertiary);
    color: var(--color-text-secondary);
  }

  // --- Outline modifier ---
  // Double-class specificity (.base-badge--outline.base-badge--{name}) overrides
  // the single-class solid variant backgrounds without needing !important
  &--outline {
    @each $name, $color in $badge-colors {
      &.base-badge--#{$name} {
        background: transparent;
        border: 1px solid $color;
        color: $color;
      }
    }
  }
}
</style>

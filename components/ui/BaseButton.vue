<script setup lang="ts">
// 1. Props & Emits
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// 2. Computed
const classes = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--disabled': props.disabled,
    'base-button--loading': props.loading,
  },
])

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="classes"
    :type="type"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="base-button__spinner" aria-hidden="true" />
    <span class="base-button__content" :class="{ 'base-button__content--hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<style lang="scss" scoped>
.base-button {
  // Layout
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;

  // Box model
  border: 1px solid transparent;
  border-radius: $border-radius-md;
  cursor: pointer;
  outline: none;

  // Typography
  font-family: $font-body;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;

  // Animation
  transition: background $transition-fast, color $transition-fast,
              border-color $transition-fast, box-shadow $transition-fast,
              transform $transition-fast;

  @include focus-ring;

  // --- Sizes ---
  &--sm {
    height: 32px;
    padding: 0 $spacing-sm;
    font-size: 12px;
    gap: 4px;
  }

  &--md {
    height: 40px;
    padding: 0 $spacing-md;
    font-size: 14px;
    gap: 6px;
  }

  &--lg {
    height: 48px;
    padding: 0 $spacing-lg;
    font-size: 16px;
    gap: 8px;
  }

  // --- Variants ---
  &--primary {
    background: $color-accent-gold;
    color: $color-text-inverse;
    border-color: $color-accent-gold;

    &:hover:not(.base-button--disabled):not(.base-button--loading) {
      background: color-mix(in srgb, $color-accent-gold 85%, white);
      box-shadow: 0 0 12px rgba($color-accent-gold, 0.4);
      transform: translateY(-1px);
    }

    &:active:not(.base-button--disabled):not(.base-button--loading) {
      transform: translateY(0);
    }
  }

  &--secondary {
    background: $color-bg-secondary;
    color: $color-text-primary;
    border-color: $color-border;

    &:hover:not(.base-button--disabled):not(.base-button--loading) {
      background: color-mix(in srgb, $color-bg-secondary 80%, white);
      border-color: $color-text-secondary;
    }
  }

  &--danger {
    background: $color-accent-red;
    color: #fff;
    border-color: $color-accent-red;

    &:hover:not(.base-button--disabled):not(.base-button--loading) {
      background: color-mix(in srgb, $color-accent-red 85%, white);
      box-shadow: 0 0 12px rgba($color-accent-red, 0.4);
      transform: translateY(-1px);
    }

    &:active:not(.base-button--disabled):not(.base-button--loading) {
      transform: translateY(0);
    }
  }

  &--ghost {
    background: transparent;
    color: $color-text-secondary;
    border-color: transparent;

    &:hover:not(.base-button--disabled):not(.base-button--loading) {
      background: rgba(255, 255, 255, 0.06);
      color: $color-text-primary;
    }
  }

  // --- States ---
  &--disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &--loading {
    cursor: wait;
  }

  // --- Inner ---
  &__content {
    display: inline-flex;
    align-items: center;
    gap: inherit;

    &--hidden {
      visibility: hidden;
    }
  }

  &__spinner {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

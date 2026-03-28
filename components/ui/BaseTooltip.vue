<script setup lang="ts">
// CSS-only positioning via data-placement — no JS position calculation.
// Wraps trigger element; tooltip appears on hover/focus.

// 1. Props
withDefaults(defineProps<{
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  disabled?: boolean
}>(), {
  placement: 'top',
  disabled: false,
})
</script>

<template>
  <div
    class="base-tooltip"
    :data-placement="placement"
    :data-disabled="disabled || undefined"
  >
    <slot />
    <div class="base-tooltip__bubble" role="tooltip">
      {{ content }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
$tooltip-gap: 6px;
$arrow-size: 5px;

.base-tooltip {
  position: relative;
  display: inline-flex;

  &[data-disabled] .base-tooltip__bubble {
    display: none;
  }

  &:hover .base-tooltip__bubble,
  &:focus-within .base-tooltip__bubble {
    opacity: 1;
    pointer-events: auto;
    transform: translate(-50%, 0) scale(1);    // top (default)
  }

  &__bubble {
    position: absolute;
    z-index: $z-index-tooltip;

    padding: 5px 9px;
    max-width: 220px;

    background: color-mix(in srgb, $color-bg-secondary 60%, black);
    border: 1px solid $color-border;
    border-radius: $border-radius-sm;
    box-shadow: $shadow-md;
    backdrop-filter: blur(6px);

    font-family: $font-body;
    font-size: 11px;
    font-weight: 500;
    color: $color-text-primary;
    white-space: nowrap;
    pointer-events: none;

    opacity: 0;
    transition: opacity $transition-fast, transform $transition-fast;

    // Arrow pseudo
    &::after {
      content: '';
      position: absolute;
      border: $arrow-size solid transparent;
    }
  }

  // --- Placements ---
  // top (default)
  &[data-placement='top'],
  &:not([data-placement]) {
    .base-tooltip__bubble {
      bottom: calc(100% + $tooltip-gap);
      left: 50%;
      transform: translate(-50%, 4px) scale(0.95);

      &::after {
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-top-color: $color-border;
      }
    }

    &:hover .base-tooltip__bubble,
    &:focus-within .base-tooltip__bubble {
      transform: translate(-50%, 0) scale(1);
    }
  }

  &[data-placement='bottom'] {
    .base-tooltip__bubble {
      top: calc(100% + $tooltip-gap);
      left: 50%;
      transform: translate(-50%, -4px) scale(0.95);

      &::after {
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-bottom-color: $color-border;
      }
    }

    &:hover .base-tooltip__bubble,
    &:focus-within .base-tooltip__bubble {
      transform: translate(-50%, 0) scale(1);
    }
  }

  &[data-placement='left'] {
    .base-tooltip__bubble {
      right: calc(100% + $tooltip-gap);
      top: 50%;
      transform: translate(4px, -50%) scale(0.95);

      &::after {
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        border-left-color: $color-border;
      }
    }

    &:hover .base-tooltip__bubble,
    &:focus-within .base-tooltip__bubble {
      transform: translate(0, -50%) scale(1);
    }
  }

  &[data-placement='right'] {
    .base-tooltip__bubble {
      left: calc(100% + $tooltip-gap);
      top: 50%;
      transform: translate(-4px, -50%) scale(0.95);

      &::after {
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        border-right-color: $color-border;
      }
    }

    &:hover .base-tooltip__bubble,
    &:focus-within .base-tooltip__bubble {
      transform: translate(0, -50%) scale(1);
    }
  }
}
</style>

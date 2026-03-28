<script setup lang="ts">
import { formatStack } from '@/utils/format'

const props = withDefaults(defineProps<{
  modelValue: number
  min: number
  max: number
  step?: number
}>(), {
  step: 1,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// Fill percentage for the track gradient
const pct = computed(() => {
  if (props.max <= props.min) return 0
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100
})

function onInput(e: Event) {
  emit('update:modelValue', Number((e.target as HTMLInputElement).value))
}

// Clamp tooltip so it never overflows the track edges.
// At pct=0 the tooltip would shift left out of view; at pct=100 — right.
// We clamp to [4%, 96%] which keeps it comfortably within the padded container.
const tooltipLeft = computed(() => `clamp(4%, ${pct.value}%, 96%)`)
</script>

<template>
  <div class="bet-slider">
    <!-- Value tooltip above thumb -->
    <div
      class="bet-slider__tooltip"
      :style="{ left: tooltipLeft }"
    >
      {{ formatStack(modelValue) }}
    </div>

    <!-- Range input -->
    <div class="bet-slider__track-wrap">
      <input
        type="range"
        class="bet-slider__input"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        :style="{ '--pct': `${pct}%` }"
        aria-label="Bet amount"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="modelValue"
        :aria-valuetext="formatStack(modelValue)"
        @input="onInput"
      />
    </div>

    <!-- Min / Max labels -->
    <div class="bet-slider__labels">
      <span>{{ formatStack(min) }}</span>
      <span>{{ formatStack(max) }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$thumb-size: 18px;
$track-h: 5px;
$track-color: rgba(255, 255, 255, 0.12);
$fill-color: $color-accent-gold;

.bet-slider {
  display: flex;
  flex-direction: column;
  gap: $spacing-1;
  width: 100%;
  padding: 0 calc($thumb-size / 2); // keep thumb inside bounds

  &__tooltip {
    position: relative;
    // Offset by half thumb so the tooltip center tracks the thumb center
    transform: translateX(-50%);
    align-self: flex-start;

    font-family: $font-mono;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    color: $color-accent-gold;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba($color-accent-gold, 0.35);
    border-radius: $radius-md;
    padding: 2px $spacing-1;
    white-space: nowrap;
    pointer-events: none;

    // Small arrow pointing down
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 4px solid transparent;
      border-top-color: rgba($color-accent-gold, 0.35);
    }
  }

  &__track-wrap {
    position: relative;
    height: $thumb-size;
    @include flex-center;
  }

  &__input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: $track-h;
    border-radius: $radius-full;
    cursor: pointer;
    outline: none;

    // Two-tone track: gold fill up to thumb, then dim
    background: linear-gradient(
      to right,
      $fill-color 0%,
      $fill-color var(--pct, 0%),
      $track-color var(--pct, 0%),
      $track-color 100%
    );

    // ── Thumb — WebKit ───────────────────────────────────────────────────────
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: $thumb-size;
      height: $thumb-size;
      border-radius: $radius-full;
      background: radial-gradient(circle at 38% 35%, #fff9e0, $color-accent-gold 60%);
      border: 2px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5), $shadow-glow-gold;
      cursor: grab;
      transition: transform $transition-fast, box-shadow $transition-fast;

      &:active {
        cursor: grabbing;
        transform: scale(1.2);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.6), 0 0 18px rgba($color-accent-gold, 0.55);
      }
    }

    // ── Thumb — Firefox ──────────────────────────────────────────────────────
    &::-moz-range-thumb {
      width: $thumb-size;
      height: $thumb-size;
      border-radius: $radius-full;
      background: radial-gradient(circle at 38% 35%, #fff9e0, $color-accent-gold 60%);
      border: 2px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
      cursor: grab;

      &:active { cursor: grabbing; }
    }

    // Firefox track fill is handled via background gradient above
    &::-moz-range-track {
      background: transparent;
    }
  }

  &__labels {
    display: flex;
    justify-content: space-between;
    font-family: $font-mono;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }
}
</style>

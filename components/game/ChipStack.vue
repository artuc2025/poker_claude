<script setup lang="ts">
import { formatStack } from '@/utils/format'

const props = defineProps<{
  amount: number
}>()

// Chip denominations — highest first
const DENOMS = [
  { value: 1000, color: '#f0c040', border: '#c89a10' }, // gold
  { value:  500, color: '#9b59b6', border: '#7d3f9a' }, // purple
  { value:  100, color: '#2c3e50', border: '#1a2533' }, // black
  { value:   25, color: '#2ecc71', border: '#1fa355' }, // green
  { value:   10, color: '#3498db', border: '#1d7ab8' }, // blue
  { value:    5, color: '#e74c3c', border: '#c0392b' }, // red
  { value:    1, color: '#f0f0f0', border: '#bdbdbd' }, // white
] as const

interface Chip { color: string; border: string }

// Break amount into chip denominations, keep top 4 non-zero types for display
const chips = computed((): Chip[] => {
  let remaining = props.amount
  const result: Chip[] = []
  for (const d of DENOMS) {
    const count = Math.floor(remaining / d.value)
    if (count > 0) {
      result.push({ color: d.color, border: d.border })
      remaining -= count * d.value
    }
    if (result.length === 4) break
  }
  return result
})
</script>

<template>
  <div class="chip-stack">
    <!-- Stacked chips: each subsequent chip is offset upward -->
    <div class="chip-stack__pile">
      <div
        v-for="(chip, i) in chips"
        :key="i"
        class="chip-stack__chip"
        :style="{
          background: chip.color,
          borderColor: chip.border,
          bottom: `${i * 4}px`,
          zIndex: chips.length - i,
        }"
      >
        <!-- Stripe pattern on chip edge -->
        <span class="chip-stack__stripe" :style="{ background: chip.border }" />
      </div>
    </div>

    <!-- Amount label -->
    <span class="chip-stack__label">{{ formatStack(amount) }}</span>
  </div>
</template>

<style lang="scss" scoped>
$chip-d: 14px; // diameter

.chip-stack {
  display: flex;
  align-items: flex-end;
  gap: $spacing-1;

  &__pile {
    position: relative;
    width: $chip-d;
    // height = base chip + stagger for up to 4 chips (3 × 4px offsets)
    height: calc(#{$chip-d} + 3 * 4px);
    flex-shrink: 0;
  }

  &__chip {
    position: absolute;
    left: 0;
    width: $chip-d;
    height: $chip-d;
    border-radius: $radius-full;
    border: 1.5px solid;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    @include flex-center;
  }

  &__stripe {
    // A thin cross-stripe typical of casino chips
    display: block;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 3px;
    transform: translateY(-50%);
    opacity: 0.45;
  }

  &__label {
    font-family: $font-mono;
    font-size: $font-size-xs;
    color: $color-accent-gold;
    line-height: 1;
    white-space: nowrap;
  }
}
</style>

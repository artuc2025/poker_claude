<script setup lang="ts">
// DealerButton is rendered as a single absolutely-positioned element on
// GameTable so it can animate (CSS transition on left/top) when the dealer
// seat changes between rounds.

const props = defineProps<{
  seatIndex: number
  // Same [left%, top%] array that GameTable uses for seat anchors
  seatPositions: readonly [number, number][]
}>()

// Table dimensions must match $table-width / $table-height in _variables.scss.
// We convert %-based seat anchors to pixel values so we can animate only via
// `transform` (GPU-composited, no layout reflow) instead of `left`/`top`.
const TABLE_W = 900
const TABLE_H = 540
const INWARD  = 0.12 // pull 12 % toward center so button sits on the felt

const style = computed(() => {
  const pos = props.seatPositions[props.seatIndex]
  if (!pos) return {}

  const [l, t] = pos
  const leftPct = l + (50 - l) * INWARD
  const topPct  = t + (50 - t) * INWARD

  // Pixel offset from table origin; -50% centres the element on the anchor.
  const x = (leftPct / 100) * TABLE_W
  const y = (topPct  / 100) * TABLE_H

  return { transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))` }
})
</script>

<template>
  <Transition name="dealer-appear">
    <div class="dealer-button" :style="style">
      D
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.dealer-button {
  position: absolute;
  left: 0;
  top: 0;
  // transform is set via inline style — transition here is GPU-composited,
  // no layout reflow unlike transitioning left/top.
  transition: transform $transition-slow;
  will-change: transform;
  z-index: $z-index-raised;

  width: 28px;
  height: 28px;
  border-radius: $radius-full;

  background: radial-gradient(circle at 38% 35%, #fff9e0, $color-accent-gold 55%, $color-accent-gold-dim);
  border: 2px solid rgba(255, 255, 255, 0.55);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);

  font-family: $font-display;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: #1a1000;
  letter-spacing: 0.02em;

  @include flex-center;

  // Smooth glide between seats
  transition:
    left  $transition-slow,
    top   $transition-slow;
}

// Subtle pop-in on first render / seat change
// The inline-style transform already encodes position.
// We compose scale on top of it via a CSS variable so the Transition only
// adds/removes a scale modifier without clobbering the position transform.
.dealer-appear-enter-active {
  transition: opacity 200ms ease, scale 200ms $transition-spring;
}
.dealer-appear-leave-active {
  transition: opacity 150ms ease, scale 150ms ease;
}
.dealer-appear-enter-from {
  opacity: 0;
  scale: 0.55;
}
.dealer-appear-leave-to {
  opacity: 0;
  scale: 0.55;
}
</style>

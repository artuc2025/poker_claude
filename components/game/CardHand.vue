<script setup lang="ts">
import type { Card } from '@/types/game'
import PlayingCard from '@/components/game/PlayingCard.vue'

const props = withDefaults(defineProps<{
  cards: Card[]
  isHero?: boolean
}>(), {
  isHero: false,
})

// Hero cards are face-down by default; hovering peeks (reveals) them.
const peeking = ref(false)

function onEnter() { if (props.isHero) peeking.value = true }
function onLeave() { if (props.isHero) peeking.value = false }

const faceDown = computed(() => {
  if (!props.isHero) return true   // opponents: always hidden
  return !peeking.value            // hero: hidden until hover
})
</script>

<template>
  <div
    :class="['card-hand', { 'card-hand--hero': isHero }]"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <!-- Dealt cards -->
    <template v-if="cards.length === 2">
      <PlayingCard
        :card="cards[0]!"
        :face-down="faceDown"
        size="sm"
        class="card-hand__card card-hand__card--left"
      />
      <PlayingCard
        :card="cards[1]!"
        :face-down="faceDown"
        size="sm"
        class="card-hand__card card-hand__card--right"
      />
    </template>

    <!-- Empty placeholders -->
    <template v-else>
      <div class="card-hand__placeholder" />
      <div class="card-hand__placeholder" />
    </template>

    <!-- Peek hint for hero when no cards yet or not peeking -->
    <span v-if="isHero && cards.length === 2 && !peeking" class="card-hand__hint">
      hover
    </span>
  </div>
</template>

<style lang="scss" scoped>
$fan-gap: 4px;

.card-hand {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: $fan-gap;

  // ---- Cards ----
  &__card {
    transition: transform 0.22s ease, box-shadow 0.22s ease;

    &--left  { transform: rotate(-4deg) translateY(1px); }
    &--right { transform: rotate(4deg)  translateY(1px); }
  }

  // Hero peek: lift cards on hover
  &--hero:hover &__card {
    &--left  { transform: rotate(-8deg) translateY(-4px); box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
    &--right { transform: rotate(8deg)  translateY(-4px); box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
  }

  // ---- Placeholder (no cards yet) ----
  &__placeholder {
    width: $card-sm-width;
    height: $card-sm-height;
    border-radius: 3px;
    border: 2px dashed rgba(255, 255, 255, 0.08);
    background: rgba(0, 0, 0, 0.15);
  }

  // ---- Hover hint label ----
  &__hint {
    position: absolute;
    bottom: -14px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 8px;
    letter-spacing: 0.06em;
    color: rgba(255, 255, 255, 0.25);
    white-space: nowrap;
    pointer-events: none;
    text-transform: uppercase;
  }
}
</style>

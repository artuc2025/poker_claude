<script setup lang="ts">
import type { Card, Suit } from '@/types/game'

const props = withDefaults(defineProps<{
  card: Card
  faceDown?: boolean
  size?: 'sm' | 'md'
}>(), {
  faceDown: false,
  size: 'md',
})

const SUIT_SYMBOL: Record<Suit, string> = {
  hearts:   '♥',
  diamonds: '♦',
  clubs:    '♣',
  spades:   '♠',
}

const isRed  = computed(() => props.card.suit === 'hearts' || props.card.suit === 'diamonds')
const symbol = computed(() => SUIT_SYMBOL[props.card.suit])
</script>

<template>
  <div
    :class="[
      'playing-card',
      `playing-card--${size}`,
      { 'playing-card--revealed': !faceDown },
    ]"
  >
    <!-- Back face (shown when faceDown) -->
    <div class="playing-card__back">
      <div class="playing-card__back-pattern" />
    </div>

    <!-- Front face (shown when revealed) -->
    <div :class="['playing-card__front', { 'playing-card__front--red': isRed }]">
      <span class="playing-card__corner playing-card__corner--tl">
        <span class="playing-card__rank">{{ card.rank }}</span>
        <span class="playing-card__suit-sm">{{ symbol }}</span>
      </span>
      <span class="playing-card__symbol">{{ symbol }}</span>
      <span class="playing-card__corner playing-card__corner--br">
        <span class="playing-card__rank">{{ card.rank }}</span>
        <span class="playing-card__suit-sm">{{ symbol }}</span>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// ---- Size tokens ----
$card-sm-w: 22px;
$card-sm-h: 30px;

.playing-card {
  position: relative;
  border-radius: $card-radius;
  transform-style: preserve-3d;
  transition: transform 0.38s ease;
  flex-shrink: 0;

  &--md { width: $card-width;  height: $card-height; }
  &--sm { width: $card-sm-w;   height: $card-sm-h;   }

  // Flip to front when revealed
  &--revealed { transform: rotateY(180deg); }

  // ---- Shared face base ----
  &__back,
  &__front {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  // ---- Back face ----
  &__back {
    background: linear-gradient(135deg, #1a3a5c 0%, #0d2137 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    overflow: hidden;
    @include flex-center;
  }

  &__back-pattern {
    position: absolute;
    inset: 3px;
    border-radius: calc(#{$card-radius} - 2px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 3px,
      rgba(255, 255, 255, 0.025) 3px,
      rgba(255, 255, 255, 0.025) 6px
    );
  }

  // ---- Front face ----
  &__front {
    transform: rotateY(180deg);
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.12);
    color: #1a1a2e;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &--red {
      color: $color-suit-hearts;
    }
  }

  &__corner {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;

    &--tl { top: 2px;    left:  3px; }
    &--br {
      bottom: 2px;
      right:  3px;
      transform: rotate(180deg);
    }
  }

  &__rank {
    font-family: $font-display;
    font-weight: $font-weight-bold;
    line-height: 1;

    .playing-card--md & { font-size: 13px; }
    .playing-card--sm & { font-size: 7px;  }
  }

  &__suit-sm {
    font-size: 8px;
    line-height: 1;

    .playing-card--sm & { display: none; }
  }

  &__symbol {
    font-size: 28px;
    line-height: 1;
    user-select: none;

    .playing-card--sm & { font-size: 12px; }
  }
}
</style>

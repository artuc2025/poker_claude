<script setup lang="ts">
import type { SeatState, SeatStatus } from '@/types/game'
import PlayingCard from './PlayingCard.vue'

const props = withDefaults(defineProps<{
  seat: SeatState | null
  seatIndex: number
  playerName?: string
  isDealer?: boolean
  isActive?: boolean
}>(), {
  playerName: '',
  isDealer: false,
  isActive: false,
})

const STATUS_LABEL: Partial<Record<SeatStatus, string>> = {
  folded: 'FOLD',
  'all-in': 'ALL IN',
  'sitting-out': 'AWAY',
}

const statusLabel = computed(() =>
  props.seat ? (STATUS_LABEL[props.seat.status] ?? '') : ''
)

function formatStack(amount: number): string {
  return amount >= 1000 ? `$${(amount / 1000).toFixed(1)}k` : `$${amount}`
}
</script>

<template>
  <div
    :class="[
      'player-seat',
      {
        'player-seat--hero': seat?.isHero,
        'player-seat--active': isActive,
        'player-seat--folded': seat?.status === 'folded',
        'player-seat--allin': seat?.status === 'all-in',
        'player-seat--empty': seat === null,
      },
    ]"
  >
    <!-- Occupied -->
    <template v-if="seat">
      <div class="player-seat__top">
        <BaseAvatar
          :name="playerName"
          size="sm"
          variant="circle"
          class="player-seat__avatar"
        />
        <div class="player-seat__info">
          <span class="player-seat__name">{{ playerName }}</span>
          <span class="player-seat__stack">{{ formatStack(seat.stackSize) }}</span>
        </div>
      </div>

      <div class="player-seat__cards">
        <template v-if="seat.holeCards.length === 2">
          <PlayingCard
            v-for="card in seat.holeCards"
            :key="card.id"
            :card="card"
            :face-down="!seat.isHero"
            size="sm"
          />
        </template>
        <template v-else>
          <div class="player-seat__card-back" />
          <div class="player-seat__card-back" />
        </template>
      </div>

      <!-- Status overlay (fold / all-in / away) -->
      <div v-if="statusLabel" class="player-seat__status">
        {{ statusLabel }}
      </div>

      <!-- Dealer button -->
      <span v-if="isDealer" class="player-seat__dealer">D</span>

      <!-- Active timer bar -->
      <div v-if="isActive" class="player-seat__timer-bar" />
    </template>

    <!-- Empty slot -->
    <template v-else>
      <span class="player-seat__slot-num">{{ seatIndex + 1 }}</span>
      <span class="player-seat__slot-label">Empty</span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
$seat-w: 120px;
$seat-h: 88px;
$card-back-w: 22px;
$card-back-h: 30px;

.player-seat {
  position: relative;
  width: $seat-w;
  height: $seat-h;
  border-radius: $radius-lg;
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-1;
  padding: $spacing-2 $spacing-2 $spacing-1;
  transition: border-color $transition-base, box-shadow $transition-base, opacity $transition-base;
  overflow: hidden;

  // ---- Modifiers ----

  &--hero {
    border-color: $color-accent-gold;
    box-shadow: 0 0 14px rgba(240, 192, 64, 0.28);
  }

  &--active {
    border-color: $color-accent-green;
    box-shadow: 0 0 16px rgba(46, 204, 113, 0.38);
  }

  // hero + active: active wins
  &--hero#{&}--active {
    border-color: $color-accent-green;
    box-shadow: 0 0 16px rgba(46, 204, 113, 0.5);
  }

  &--folded {
    opacity: 0.38;
  }

  &--allin {
    border-color: $color-accent-red;
    box-shadow: 0 0 12px rgba(231, 76, 60, 0.3);
  }

  &--empty {
    background: transparent;
    border: 2px dashed var(--color-border-primary);
    box-shadow: none;
    opacity: 0.45;
    justify-content: center;
  }

  // ---- Elements ----

  &__top {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    width: 100%;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 1px;
    overflow: hidden;
  }

  &__name {
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 64px;
  }

  &__stack {
    font-family: $font-mono;
    font-size: $font-size-xs;
    color: $color-accent-gold;
    line-height: 1;
  }

  &__cards {
    display: flex;
    gap: $spacing-1;
    margin-top: auto;
  }

  &__card-back {
    width: $card-back-w;
    height: $card-back-h;
    border-radius: 3px;
    background: linear-gradient(135deg, #1a3a5c 0%, #0d2137 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.04);
  }

  &__status {
    position: absolute;
    inset: 0;
    @include flex-center;
    background: rgba(0, 0, 0, 0.55);
    border-radius: $radius-lg;
    font-family: $font-display;
    font-size: $font-size-sm;
    letter-spacing: 0.08em;
    color: var(--color-text-primary);
    pointer-events: none;
  }

  &__dealer {
    position: absolute;
    top: -9px;
    right: -9px;
    width: 20px;
    height: 20px;
    border-radius: $radius-full;
    background: $color-accent-gold;
    color: #0d1117;
    font-family: $font-display;
    font-size: 11px;
    font-weight: $font-weight-bold;
    @include flex-center;
    box-shadow: var(--shadow-sm);
    z-index: $z-index-raised;
  }

  &__timer-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 100%;
    background: linear-gradient(90deg, $color-accent-green, rgba(46, 204, 113, 0.3));
    border-radius: 0 0 $radius-lg $radius-lg;
    animation: timer-pulse 1.5s ease-in-out infinite;
  }

  &__slot-num {
    font-family: $font-display;
    font-size: $font-size-xl;
    color: var(--color-text-muted);
    line-height: 1;
  }

  &__slot-label {
    font-size: $font-size-xs;
    color: var(--color-text-muted);
  }
}

@keyframes timer-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}
</style>

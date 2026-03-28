<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import type { PlayerAction } from '@/types/game'
import { formatStack } from '@/utils/format'
import BetSlider from '@/components/game/BetSlider.vue'

const emit = defineEmits<{
  action: [action: PlayerAction, amount?: number]
}>()

const gameStore = useGameStore()

// ─── Derived state ────────────────────────────────────────────────────────────

const hero = computed(() => gameStore.heroSeat)

// Highest bet currently on the table
const highestBet = computed(() =>
  Math.max(0, ...gameStore.occupiedSeats.map((s) => s.currentBet)),
)

// How much hero still needs to put in to call
const callAmount = computed(() => {
  if (!hero.value) return 0
  return Math.max(0, highestBet.value - hero.value.currentBet)
})

const canCheck = computed(() => callAmount.value === 0)

// ─── Raise amount ─────────────────────────────────────────────────────────────

const minRaise = computed(() => gameStore.bigBlind)
const maxRaise = computed(() => hero.value?.stackSize ?? 0)

const raiseAmount = ref(gameStore.bigBlind * 2)

// Keep raiseAmount in bounds when bigBlind / stack changes
watch([minRaise, maxRaise], () => {
  raiseAmount.value = Math.min(
    Math.max(raiseAmount.value, minRaise.value),
    maxRaise.value,
  )
})

// Quick-preset helpers
const halfPot = computed(() =>
  Math.min(Math.floor(gameStore.totalPot / 2), maxRaise.value),
)
const fullPot = computed(() =>
  Math.min(gameStore.totalPot, maxRaise.value),
)

function setPreset(amount: number) {
  raiseAmount.value = Math.max(minRaise.value, Math.min(amount, maxRaise.value))
}

// ─── Actions ──────────────────────────────────────────────────────────────────

function onFold()      { emit('action', 'fold') }
function onCheck()     { emit('action', 'check') }
function onCall()      { emit('action', 'call', callAmount.value) }
function onCheckCall() { canCheck.value ? onCheck() : onCall() }

function onRaise() {
  const amount = raiseAmount.value
  const action: PlayerAction = amount >= maxRaise.value ? 'all-in' : 'raise'
  emit('action', action, amount)
}

const isAllIn = computed(() => raiseAmount.value >= maxRaise.value)
</script>

<template>
  <div class="action-panel">
    <!-- Raise controls row -->
    <div class="action-panel__raise-row">
      <div class="action-panel__presets">
        <button
          class="action-panel__preset"
          :disabled="halfPot <= 0"
          @click="setPreset(halfPot)"
        >½ Pot</button>
        <button
          class="action-panel__preset"
          :disabled="fullPot <= 0"
          @click="setPreset(fullPot)"
        >Pot</button>
        <button
          class="action-panel__preset"
          @click="setPreset(maxRaise)"
        >All-In</button>
      </div>

      <BetSlider
        v-model="raiseAmount"
        :min="minRaise"
        :max="maxRaise"
        :step="minRaise"
        class="action-panel__slider"
      />
    </div>

    <!-- Main action buttons -->
    <div class="action-panel__buttons">
      <button class="action-panel__btn action-panel__btn--fold" @click="onFold">
        Fold
      </button>

      <button
        class="action-panel__btn action-panel__btn--check-call"
        @click="onCheckCall"
      >
        <span v-if="canCheck">Check</span>
        <span v-else>
          Call
          <span class="action-panel__btn-sub">{{ formatStack(callAmount) }}</span>
        </span>
      </button>

      <button
        class="action-panel__btn action-panel__btn--raise"
        :class="{ 'action-panel__btn--allin': isAllIn }"
        @click="onRaise"
      >
        <span v-if="isAllIn">All-In</span>
        <span v-else>
          Raise
          <span class="action-panel__btn-sub">{{ formatStack(raiseAmount) }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.action-panel {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  width: 480px;

  // ── Raise row ──────────────────────────────────────────────────────────────

  &__raise-row {
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
    background: rgba(0, 0, 0, 0.45);
    border-radius: $radius-lg;
    border: 1px solid rgba(255, 255, 255, 0.07);
    padding: $spacing-3;
    backdrop-filter: blur(6px);
  }

  &__presets {
    display: flex;
    gap: $spacing-1;
  }

  &__preset {
    height: 26px;
    padding: 0 $spacing-2;
    border-radius: $radius-md;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: $color-text-secondary;
    font-size: $font-size-xs;
    font-family: $font-body;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: background $transition-fast, color $transition-fast;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.14);
      color: $color-text-primary;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  &__slider {
    // let BetSlider fill the row width
    width: 100%;
  }

  // ── Buttons ────────────────────────────────────────────────────────────────

  &__buttons {
    display: grid;
    grid-template-columns: 1fr 1.4fr 1.4fr;
    gap: $spacing-2;
  }

  &__btn {
    height: 52px;
    border-radius: $radius-lg;
    border: none;
    cursor: pointer;
    font-family: $font-display;
    font-size: $font-size-md;
    letter-spacing: 0.06em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    transition:
      background $transition-fast,
      box-shadow $transition-fast,
      transform $transition-fast;

    &:active { transform: scale(0.97); }

    &-sub {
      font-family: $font-mono;
      font-size: $font-size-xs;
      opacity: 0.8;
      letter-spacing: 0;
    }

    // Fold — muted red
    &--fold {
      background: rgba($color-accent-red, 0.18);
      border: 1px solid rgba($color-accent-red, 0.35);
      color: color-mix(in srgb, $color-accent-red 85%, white);

      &:hover {
        background: rgba($color-accent-red, 0.3);
        box-shadow: 0 0 12px rgba($color-accent-red, 0.25);
      }
    }

    // Check / Call — green
    &--check-call {
      background: rgba($color-accent-green, 0.18);
      border: 1px solid rgba($color-accent-green, 0.35);
      color: color-mix(in srgb, $color-accent-green 85%, white);

      &:hover {
        background: rgba($color-accent-green, 0.3);
        box-shadow: 0 0 12px rgba($color-accent-green, 0.25);
      }
    }

    // Raise — gold
    &--raise {
      background: rgba($color-accent-gold, 0.18);
      border: 1px solid rgba($color-accent-gold, 0.4);
      color: $color-accent-gold;

      &:hover {
        background: rgba($color-accent-gold, 0.28);
        box-shadow: 0 0 12px rgba($color-accent-gold, 0.3);
      }
    }

    // All-In override — bright gold
    &--allin {
      background: $color-accent-gold;
      color: #1a1000;
      border-color: $color-accent-gold;

      &:hover {
        background: color-mix(in srgb, $color-accent-gold 85%, white);
        box-shadow: $shadow-glow-gold;
      }
    }
  }
}
</style>

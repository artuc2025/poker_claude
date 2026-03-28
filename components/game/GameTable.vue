<script setup lang="ts">
import type { Table } from '@/types/table'
import type { SeatState } from '@/types/game'
import { useGameStore } from '@/stores/game'
import { MOCK_HERO, MOCK_PLAYERS } from '@/data/mock/players'

const props = defineProps<{
  table: Table
}>()

const gameStore = useGameStore()

// [left%, top%] center anchor for each seat. Seat 6 = HERO (bottom center).
const SEAT_POSITIONS: readonly [number, number][] = [
  [4, 46],   // 0: left mid
  [24, 7],   // 1: top-left
  [50, 2],   // 2: top center
  [76, 7],   // 3: top-right
  [96, 46],  // 4: right mid
  [96, 70],  // 5: right lower
  [50, 94],  // 6: bottom center — HERO
  [27, 88],  // 7: bottom-left
  [4, 70],   // 8: left lower
]

const PLAYER_NAME_MAP: Record<string, string> = Object.fromEntries(
  [MOCK_HERO, ...MOCK_PLAYERS].map((p) => [p.id, p.name])
)

function getSeatName(seat: SeatState): string {
  return PLAYER_NAME_MAP[seat.playerId] ?? 'Unknown'
}

function formatStack(amount: number): string {
  return amount >= 1000 ? `$${(amount / 1000).toFixed(1)}k` : `$${amount}`
}

onMounted(() => {
  if (gameStore.seats.some((s) => s !== null)) return

  const maxPlayers = props.table.config.maxPlayers
  const buyIn = props.table.config.stakes.bigBlind * 100
  const opponents = MOCK_PLAYERS.slice(0, maxPlayers - 1)
  const newSeats: (SeatState | null)[] = Array(9).fill(null)

  newSeats[6] = {
    playerId: MOCK_HERO.id,
    seatIndex: 6,
    stackSize: Math.min(MOCK_HERO.bankroll, buyIn),
    currentBet: 0,
    status: 'active',
    holeCards: [],
    isHero: true,
  }

  let opponentIdx = 0
  for (let i = 0; i < 9; i++) {
    if (i === 6) continue
    const player = opponents[opponentIdx]
    if (player) {
      newSeats[i] = {
        playerId: player.id,
        seatIndex: i,
        stackSize: Math.min(player.bankroll, buyIn),
        currentBet: 0,
        status: 'active',
        holeCards: [],
        isHero: false,
      }
      opponentIdx++
    }
  }

  gameStore.$patch({
    id: props.table.id,
    smallBlind: props.table.config.stakes.smallBlind,
    bigBlind: props.table.config.stakes.bigBlind,
    phase: 'waiting',
    dealerSeatIndex: 1,
    seats: newSeats,
  })
})
</script>

<template>
  <div class="game-table">
    <div class="game-table__rail">
      <div class="game-table__felt">
        <div class="game-table__center">
          <div class="game-table__community">
            <div v-for="n in 5" :key="n" class="game-table__card-slot" />
          </div>
          <div class="game-table__pot">
            <span class="game-table__pot-label">POT</span>
            <span class="game-table__pot-amount">{{ formatStack(gameStore.totalPot) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-for="(pos, index) in SEAT_POSITIONS"
      :key="index"
      :style="{ left: `${pos[0]}%`, top: `${pos[1]}%` }"
      :class="[
        'game-table__seat',
        {
          'game-table__seat--occupied': gameStore.seats[index] !== null,
          'game-table__seat--hero': gameStore.seats[index]?.isHero,
          'game-table__seat--active': gameStore.currentSeatIndex === index,
          'game-table__seat--folded': gameStore.seats[index]?.status === 'folded',
        },
      ]"
    >
      <template v-if="gameStore.seats[index]">
        <span class="game-table__seat-name">{{ getSeatName(gameStore.seats[index]!) }}</span>
        <span class="game-table__seat-stack">{{ formatStack(gameStore.seats[index]!.stackSize) }}</span>
        <span v-if="gameStore.dealerSeatIndex === index" class="game-table__dealer-btn">D</span>
      </template>
      <template v-else>
        <span class="game-table__seat-empty">{{ index + 1 }}</span>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$seat-w: 110px;
$seat-h: 68px;

.game-table {
  position: relative;
  width: $table-width;
  height: $table-height;
  max-width: 100%;

  &__rail {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(160deg, #5c3a1e 0%, #3d2200 50%, #2a1800 100%);
    box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.06), var(--shadow-xl);
    padding: $table-border-width;
  }

  &__felt {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(
      ellipse 80% 70% at 50% 50%,
      $color-bg-table-felt 0%,
      $color-bg-table 55%,
      color-mix(in srgb, $color-bg-table 75%, black) 100%
    );
    @include flex-center;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.05);
      pointer-events: none;
    }
  }

  &__center {
    @include flex-center;
    flex-direction: column;
    gap: $spacing-3;
    position: relative;
    z-index: $z-index-raised;
  }

  &__community {
    display: flex;
    gap: $spacing-2;
    align-items: center;
  }

  &__card-slot {
    width: $card-width;
    height: $card-height;
    border-radius: $card-radius;
    border: 2px dashed rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.15);
  }

  &__pot {
    @include flex-center;
    gap: $spacing-2;
  }

  &__pot-label {
    font-family: $font-display;
    font-size: $font-size-sm;
    color: var(--color-text-secondary);
    letter-spacing: 0.12em;
  }

  &__pot-amount {
    font-family: $font-display;
    font-size: $font-size-xl;
    color: $color-accent-gold;
    letter-spacing: 0.05em;
  }

  &__seat {
    position: absolute;
    transform: translate(-50%, -50%);
    width: $seat-w;
    height: $seat-h;
    border-radius: $radius-lg;
    background: var(--color-bg-secondary);
    border: 2px solid var(--color-border-primary);
    @include flex-center;
    flex-direction: column;
    gap: $spacing-1;
    z-index: $z-index-raised;
    transition: border-color $transition-base, box-shadow $transition-base, opacity $transition-base;

    &--hero {
      border-color: $color-accent-gold;
      box-shadow: 0 0 16px rgba(240, 192, 64, 0.3);
    }

    &--active {
      border-color: $color-accent-green;
      box-shadow: 0 0 16px rgba(46, 204, 113, 0.4);
    }

    &--folded {
      opacity: 0.4;
    }
  }

  &__seat-name {
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    color: var(--color-text-primary);
    @include text-ellipsis;
    max-width: 94px;
  }

  &__seat-stack {
    font-family: $font-mono;
    font-size: $font-size-xs;
    color: $color-accent-gold;
  }

  &__seat-empty {
    font-family: $font-display;
    font-size: $font-size-xl;
    color: var(--color-text-muted);
  }

  &__dealer-btn {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 22px;
    height: 22px;
    border-radius: $radius-full;
    background: $color-accent-gold;
    color: var(--color-text-inverse);
    font-family: $font-display;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    @include flex-center;
    box-shadow: var(--shadow-sm);
  }
}
</style>

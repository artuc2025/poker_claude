<script setup lang="ts">
import type { Table } from "@/types/table";
import type { SeatState } from "@/types/game";
import { useGameStore } from "@/stores/game";
import { MOCK_HERO, MOCK_PLAYERS } from "@/data/mock/players";
import { shuffleDeck, buildDeck } from "@/data/mock/cards";
import PlayerSeat from "./PlayerSeat.vue";
import CommunityCards from "./CommunityCards.vue";

const props = defineProps<{
  table: Table;
}>();

const gameStore = useGameStore();

// [left%, top%] center anchor for each seat. Seat 6 = HERO (bottom center).
// Positions computed on the table ellipse (900×540px) at 40° increments,
// k=0.88 inset. Perfectly symmetric left↔right.
const SEAT_POSITIONS: readonly [number, number][] = [
  [12, 28],  // 0: upper-left
  [35,  9],  // 1: top-left
  [65,  9],  // 2: top-right
  [88, 28],  // 3: upper-right
  [93, 58],  // 4: right
  [78, 84],  // 5: bottom-right
  [50, 94],  // 6: bottom center — HERO
  [22, 84],  // 7: bottom-left
  [ 7, 58],  // 8: left
]

const PLAYER_NAME_MAP: Record<string, string> = Object.fromEntries(
  [MOCK_HERO, ...MOCK_PLAYERS].map((p) => [p.id, p.name]),
);

function getSeatName(seat: SeatState): string {
  return PLAYER_NAME_MAP[seat.playerId] ?? "Unknown";
}

function formatStack(amount: number): string {
  return amount >= 1000 ? `$${(amount / 1000).toFixed(1)}k` : `$${amount}`;
}

onMounted(() => {
  if (gameStore.seats.some((s) => s !== null)) return;

  const maxPlayers = props.table.config.maxPlayers;
  const buyIn = props.table.config.stakes.bigBlind * 100;
  const opponents = MOCK_PLAYERS.slice(0, maxPlayers - 1);
  const newSeats: (SeatState | null)[] = Array(9).fill(null);

  newSeats[6] = {
    playerId: MOCK_HERO.id,
    seatIndex: 6,
    stackSize: Math.min(MOCK_HERO.bankroll, buyIn),
    currentBet: 0,
    status: "active",
    holeCards: [],
    isHero: true,
  };

  let opponentIdx = 0;
  for (let i = 0; i < 9; i++) {
    if (i === 6) continue;
    const player = opponents[opponentIdx];
    if (player) {
      newSeats[i] = {
        playerId: player.id,
        seatIndex: i,
        stackSize: Math.min(player.bankroll, buyIn),
        currentBet: 0,
        status: "active",
        holeCards: [],
        isHero: false,
      };
      opponentIdx++;
    }
  }

  // Deal 2 hole cards to each occupied seat from a shuffled deck
  const deck = shuffleDeck(buildDeck());
  let cardIdx = 0;
  for (const seat of newSeats) {
    if (seat) {
      seat.holeCards = [deck[cardIdx++]!, deck[cardIdx++]!];
    }
  }

  // Deal 3 community cards (flop) for visual testing
  const communityCards = [deck[cardIdx++]!, deck[cardIdx++]!, deck[cardIdx++]!];

  gameStore.$patch({
    id: props.table.id,
    smallBlind: props.table.config.stakes.smallBlind,
    bigBlind: props.table.config.stakes.bigBlind,
    phase: "flop",
    dealerSeatIndex: 1,
    seats: newSeats,
    communityCards,
  });
});
</script>

<template>
  <div class="game-table">
    <div class="game-table__rail">
      <div class="game-table__felt">
        <div class="game-table__center">
          <CommunityCards />
          <div class="game-table__pot">
            <span class="game-table__pot-label">POT</span>
            <span class="game-table__pot-amount">{{
              formatStack(gameStore.totalPot)
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-for="(pos, index) in SEAT_POSITIONS"
      :key="index"
      :style="{ left: `${pos[0]}%`, top: `${pos[1]}%` }"
      class="game-table__seat-pos"
    >
      <PlayerSeat
        :seat="gameStore.seats[index] ?? null"
        :seat-index="index"
        :player-name="
          gameStore.seats[index] ? getSeatName(gameStore.seats[index]!) : ''
        "
        :is-dealer="gameStore.dealerSeatIndex === index"
        :is-active="gameStore.currentSeatIndex === index"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-table {
  position: relative;
  width: $table-width;
  height: $table-height;

  &__rail {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(160deg, #5c3a1e 0%, #3d2200 50%, #2a1800 100%);
    box-shadow:
      inset 0 0 0 3px rgba(255, 255, 255, 0.06),
      var(--shadow-xl);
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
      content: "";
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

  &__seat-pos {
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: $z-index-raised;
  }
}
</style>

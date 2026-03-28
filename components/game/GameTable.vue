<script setup lang="ts">
import type { Table } from "@/types/table";
import type { SeatState } from "@/types/game";
import { useGameStore } from "@/stores/game";
import { MOCK_HERO, MOCK_PLAYERS } from "@/data/mock/players";
import { shuffleDeck, buildDeck } from "@/data/mock/cards";
import PlayerSeat from "@/components/game/PlayerSeat.vue";
import CommunityCards from "@/components/game/CommunityCards.vue";
import PotDisplay from "@/components/game/PotDisplay.vue";
import DealerButton from "@/components/game/DealerButton.vue";
import ActionPanel from "@/components/game/ActionPanel.vue";
import type { PlayerAction } from "@/types/game";

const props = defineProps<{
  table: Table;
}>();

const gameStore = useGameStore();

// [left%, top%] center anchor for each seat. Seat 6 = HERO (bottom center).
// Positions computed on the table ellipse (900×540px) at 40° increments,
// k=0.88 inset. Perfectly symmetric left↔right.
const SEAT_POSITIONS: readonly [number, number][] = [
  [12, 28], // 0: upper-left
  [35, 9], // 1: top-left
  [65, 9], // 2: top-right
  [88, 28], // 3: upper-right
  [93, 58], // 4: right
  [78, 84], // 5: bottom-right
  [50, 94], // 6: bottom center — HERO
  [22, 84], // 7: bottom-left
  [7, 58], // 8: left
];

const PLAYER_NAME_MAP: Record<string, string> = Object.fromEntries(
  [MOCK_HERO, ...MOCK_PLAYERS].map((p) => [p.id, p.name]),
);

function getSeatName(seat: SeatState): string {
  return PLAYER_NAME_MAP[seat.playerId] ?? "Unknown";
}

const isHeroTurn = computed(() => {
  const hero = gameStore.heroSeat;
  return hero !== null && gameStore.currentSeatIndex === hero.seatIndex;
});

function onHeroAction(action: PlayerAction, amount?: number) {
  const hero = gameStore.heroSeat;
  if (!hero) return;
  gameStore.recordAction(action, hero.seatIndex, amount);
  gameStore.advanceCurrentSeat();
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

  // TODO: remove test deal — replaced by P2-T12 Game Engine
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
  <div class="game-table-wrap">
    <div class="game-table">
      <div class="game-table__rail">
        <div class="game-table__felt">
          <div class="game-table__center">
            <CommunityCards />
            <PotDisplay />
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
          :is-active="gameStore.currentSeatIndex === index"
        />
      </div>

      <DealerButton
        v-if="gameStore.dealerSeatIndex >= 0"
        :seat-index="gameStore.dealerSeatIndex"
        :seat-positions="SEAT_POSITIONS"
      />
    </div>

    <Transition name="action-panel">
      <ActionPanel v-if="isHeroTurn" @action="onHeroAction" />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.game-table-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-4;
}

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

  &__seat-pos {
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: $z-index-raised;
  }
}

// Slide-up transition for ActionPanel
.action-panel-enter-active {
  transition:
    opacity 220ms ease,
    transform 220ms $transition-spring;
}
.action-panel-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
.action-panel-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.action-panel-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

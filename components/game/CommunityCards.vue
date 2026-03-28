<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import PlayingCard from './PlayingCard.vue'

const gameStore = useGameStore()

// Track which card indices have been flipped face-up.
// Flip fires AFTER the slide-in animation completes for that card.
const SLIDE_MS  = 260  // must match CSS transition duration
const STAGGER_MS = 160  // per card within a batch

const revealed = ref<boolean[]>(Array(5).fill(false))

watch(
  () => gameStore.communityCards.length,
  (newLen, oldLen = 0) => {
    if (newLen === 0) {
      revealed.value = Array(5).fill(false)
      return
    }
    for (let i = oldLen; i < newLen; i++) {
      const batchIdx  = i - oldLen
      // Wait for this card's slide to finish, then flip face-up
      const flipDelay = batchIdx * STAGGER_MS + SLIDE_MS + 60
      setTimeout(() => { revealed.value[i] = true }, flipDelay)
    }
  },
  { immediate: true },
)

// CSS stagger delay for slide-in: flop (0-2) uses position within batch,
// turn/river appear alone so delay = 0
function slideDelay(n: number): string {
  return n <= 3 ? `${(n - 1) * STAGGER_MS}ms` : '0ms'
}
</script>

<template>
  <div class="community-cards">
    <template v-for="n in 5" :key="n">
      <!-- Visual separator before turn and river -->
      <div v-if="n === 4 || n === 5" class="community-cards__divider" />

      <Transition name="card-deal">
        <!-- Wrapper div so scoped CSS transition styles work correctly -->
        <div
          v-if="gameStore.communityCards[n - 1]"
          :style="{ '--slide-delay': slideDelay(n) }"
          class="community-cards__card-wrap"
        >
          <PlayingCard
            :card="gameStore.communityCards[n - 1]!"
            :face-down="!revealed[n - 1]"
            size="md"
          />
        </div>
        <div v-else class="community-cards__slot" />
      </Transition>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.community-cards {
  display: flex;
  align-items: center;
  gap: $spacing-2;

  &__divider {
    width: 1px;
    height: 24px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 1px;
    flex-shrink: 0;
  }

  &__slot {
    width: $card-width;
    height: $card-height;
    border-radius: $card-radius;
    border: 2px dashed rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.15);
    flex-shrink: 0;
  }

  &__card-wrap {
    flex-shrink: 0;
  }
}

// ---- Slide-in from left, one by one ----
// --slide-delay is set per card via inline style
.card-deal-enter-active {
  transition:
    opacity   260ms ease calc(var(--slide-delay, 0ms)),
    transform 260ms ease calc(var(--slide-delay, 0ms));
}

.card-deal-leave-active {
  transition:
    opacity   150ms ease,
    transform 150ms ease;
}

.card-deal-enter-from {
  opacity: 0;
  transform: translateX(-28px) scale(0.88);
}

.card-deal-leave-to {
  opacity: 0;
  transform: scale(0.88);
}
</style>

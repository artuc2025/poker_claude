# 📏 Rules — PokerArena Code Conventions

## Theming — ОБЯЗАТЕЛЬНО для каждого компонента

Проект поддерживает **dark** и **light** режимы через `data-theme` на `<html>`.
CSS custom properties (`var()`) переключаются автоматически — SCSS-переменные (`$`) нет.

### Правило: какой синтаксис использовать

| Категория                          | Синтаксис                       | Пример                              |
|------------------------------------|----------------------------------|--------------------------------------|
| Фон UI-элементов (panel, card)     | `var(--color-bg-*)` ✅           | `background: var(--color-bg-secondary)` |
| Текст                              | `var(--color-text-*)` ✅         | `color: var(--color-text-primary)`   |
| Границы                            | `var(--color-border-*)` ✅       | `border-color: var(--color-border-primary)` |
| Тени                               | `var(--shadow-*)` ✅             | `box-shadow: var(--shadow-md)`       |
| Акцент (gold/red/green/blue)       | `$color-accent-*` или `var()` ✅ | одинаковы в обоих темах              |
| Цвета стола/сукна                  | `$color-bg-table*` ✅            | никогда не меняются — это игровая зона |
| Цвета фишек / мастей               | `$color-chip-*`, `$color-suit-*` ✅ | игровые токены, тема не влияет    |
| Спейсинг / радиус / шрифты        | `$spacing-*`, `$radius-*`  ✅   | compile-time, тема не влияет         |

### Чеклист при создании компонента

Перед тем как закоммитить стили, пройди по каждому CSS-свойству:

- [ ] `background` / `background-color` → используй `var(--color-bg-*)`
- [ ] `color` (текст) → используй `var(--color-text-*)`
- [ ] `border-color` / `border` с цветом → используй `var(--color-border-*)`
- [ ] `box-shadow` → используй `var(--shadow-*)`
- [ ] `fill` / `stroke` на SVG-иконках → используй `currentColor` + `var(--color-text-*)`

### Пример — правильно vs неправильно

```scss
// ❌ WRONG — использует SCSS переменную, не меняется при смене темы
.player-seat {
  background: $color-bg-secondary;    // hardcoded dark
  color: $color-text-primary;         // hardcoded light text
  box-shadow: $shadow-md;             // hardcoded dark shadow
}

// ✅ CORRECT — реагирует на data-theme
.player-seat {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-md);
}

// ✅ CORRECT — игровые цвета, тема не влияет
.card-slot {
  background: $color-bg-table;        // всегда зелёный
  color: $color-accent-gold;          // всегда золотой
}
```

### Доступные CSS custom properties

Все определены в `assets/scss/main.scss`:

```
Фон:      --color-bg-primary | --color-bg-secondary | --color-bg-tertiary | --color-bg-overlay
Текст:    --color-text-primary | --color-text-secondary | --color-text-muted | --color-text-inverse
Бордеры: --color-border-primary | --color-border-secondary
Тени:     --shadow-sm | --shadow-md | --shadow-lg | --shadow-xl
Акценты:  --color-accent-gold | --color-accent-gold-dim | --color-accent-red | --color-accent-green | --color-accent-blue | --color-accent-purple
Стол:     --color-bg-table | --color-bg-table-felt  (не меняются)
```

---

## SCSS + BEM

### BEM Naming

```scss
// Block
.game-table { }

// Element (двойное подчёркивание)
.game-table__pot { }
.game-table__seat { }

// Modifier (двойной дефис)
.game-table--compact { }
.game-table__seat--active { }
.game-table__seat--folded { }
```

### BEM Rules

1. **Один блок = один компонент Vue.** `GameTable.vue` → `.game-table`
2. **Никогда не вкладывать блоки внутрь элементов:**
   - ❌ `.game-table__seat__avatar`
   - ✅ `.player-seat__avatar` (отдельный блок)
3. **Модификаторы — через props:**
   ```vue
   <div :class="['player-seat', { 'player-seat--active': isActive }]">
   ```
4. **Максимальная вложенность SCSS — 3 уровня:**
   ```scss
   .player-seat {
     &__avatar {
       &--large { }  // OK — 3 уровня
     }
   }
   ```

### SCSS File Structure в компоненте

```vue
<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;

.card-flip {
  // 1. Layout / positioning
  position: relative;
  display: flex;

  // 2. Box model
  width: 80px;
  height: 112px;
  padding: 4px;

  // 3. Visual
  background: $color-bg-secondary;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  // 4. Typography
  font-family: $font-mono;
  font-size: 14px;
  color: $color-text-primary;

  // 5. Animation
  transition: transform 0.3s ease;

  // Elements
  &__face {
    // ...
  }

  &__back {
    // ...
  }

  // Modifiers
  &--flipped {
    transform: rotateY(180deg);
  }

  &--highlighted {
    box-shadow: 0 0 12px $color-accent-gold;
  }
}
</style>
```

### SCSS Mixins — обязательные

```scss
// В _mixins.scss:

@mixin respond-to($breakpoint) {
  @if $breakpoint == 'mobile' {
    @media (max-width: $breakpoint-mobile) { @content; }
  } @else if $breakpoint == 'tablet' {
    @media (max-width: $breakpoint-tablet) { @content; }
  } @else if $breakpoint == 'desktop' {
    @media (max-width: $breakpoint-desktop) { @content; }
  }
}

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin chip-color($color) {
  background: $color;
  box-shadow: inset 0 -3px 0 darken($color, 15%),
              0 2px 4px rgba(0, 0, 0, 0.3);
}
```

---

## TypeScript

### Strict Mode — всегда

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Types — всегда в `/types/`

```typescript
// types/game.ts
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'

export interface Card {
  suit: Suit
  rank: Rank
  id: string // 'hearts-A', 'spades-10'
}

export type GamePhase = 'waiting' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown'

export type PlayerAction = 'fold' | 'check' | 'call' | 'raise' | 'all-in'

export interface GameState {
  id: string
  phase: GamePhase
  pot: number
  sidePots: SidePot[]
  communityCards: Card[]
  seats: (SeatState | null)[]  // null = пустое место
  currentSeatIndex: number
  dealerSeatIndex: number
  smallBlind: number
  bigBlind: number
}
```

### Naming Conventions

| What            | Convention          | Example                  |
|-----------------|---------------------|--------------------------|
| Interfaces      | PascalCase          | `GameState`, `Player`    |
| Types           | PascalCase          | `Suit`, `GamePhase`      |
| Enums           | PascalCase + UPPER  | `ChipValue.HUNDRED`      |
| Functions       | camelCase           | `evaluateHand()`         |
| Composables     | `use` + PascalCase  | `useGameEngine()`        |
| Constants       | UPPER_SNAKE         | `MAX_PLAYERS_PER_TABLE`  |
| Files (types)   | kebab-case          | `game.ts`, `player.ts`   |
| Files (comps)   | PascalCase          | `GameTable.vue`          |

### No `any`. Никогда.

```typescript
// ❌
function getPlayer(id: any): any { }

// ✅
function getPlayer(id: string): Player | undefined { }
```

### Composables — шаблон

```typescript
// composables/useTimer.ts
export function useTimer(durationSeconds: number) {
  const remaining = ref(durationSeconds)
  const isRunning = ref(false)
  const isExpired = computed(() => remaining.value <= 0)

  let intervalId: ReturnType<typeof setInterval> | null = null

  function start() {
    // ...
  }

  function stop() {
    // ...
  }

  function reset() {
    // ...
  }

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })

  return { remaining, isRunning, isExpired, start, stop, reset }
}
```

---

## Vue Components

### Script Setup — всегда

```vue
<script setup lang="ts">
// 1. Imports
import type { Card } from '@/types/game'

// 2. Props & Emits
const props = defineProps<{
  card: Card
  isFlipped?: boolean
}>()

const emit = defineEmits<{
  flip: [card: Card]
}>()

// 3. Composables
const { remaining, start } = useTimer(30)

// 4. Reactive state
const isHovered = ref(false)

// 5. Computed
const cardClass = computed(() => ({
  'card-flip': true,
  'card-flip--flipped': props.isFlipped,
}))

// 6. Methods
function handleClick() {
  emit('flip', props.card)
}

// 7. Lifecycle
onMounted(() => { })
</script>
```

### Template Rules

```vue
<template>
  <!-- Один root div с BEM block class -->
  <div :class="cardClass" @click="handleClick">
    <div class="card-flip__face card-flip__face--front">
      <!-- Контент -->
    </div>
    <div class="card-flip__face card-flip__face--back">
      <!-- Рубашка -->
    </div>
  </div>
</template>
```

### Props — всегда типизированы с дефолтами

```typescript
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}>(), {
  size: 'md',
  variant: 'primary',
  disabled: false,
})
```

---

## Git Conventions

### Branch Naming
```
feature/TASK_ID-short-description
fix/TASK_ID-short-description
```

### Commit Messages
```
feat(game): add card flip animation [P1-T03]
fix(lobby): correct table filter logic [P1-T07]
style(ui): update button hover states [P1-T02]
refactor(store): split game store actions [P2-T01]
```

---

## File Size Limits

| Type        | Max Lines | Action if exceeded             |
|-------------|-----------|--------------------------------|
| Component   | 200       | Extract sub-components          |
| Composable  | 150       | Split by responsibility         |
| Store       | 200       | Split into sub-stores           |
| SCSS file   | 150       | Extract partials                |
| Type file   | 100       | Split by domain                 |

---

## Anti-Patterns — ЗАПРЕЩЕНО

1. ❌ Inline styles в template
2. ❌ `!important` в SCSS (кроме 3rd-party override)
3. ❌ Прямое изменение props
4. ❌ `v-html` без санитизации
5. ❌ Business logic в компонентах (только в composables/stores)
6. ❌ Magic numbers без констант
7. ❌ Коммиты без TASK_ID
8. ❌ Компоненты без TypeScript props
9. ❌ `@import` в SCSS (используй `@use`)
10. ❌ Вложенность BEM-элементов (`.block__el1__el2`)
11. ❌ Удалять определение SCSS-переменной отдельно от её использований
12. ❌ Использовать компонент в template без явного импорта

### Правило #11 — SCSS local variables: определение и использование меняются вместе

Vite/Sass компилирует файл сразу после каждого сохранения. Если удалить определение `$var` в одном шаге, а использование — в следующем, сервер упадёт с `Undefined variable` между правками.

```scss
// ❌ WRONG — два отдельных шага
// Шаг 1: удалил $seat-w: 110px;  → сервер падает!
// Шаг 2: удалил width: $seat-w;

// ✅ CORRECT — всегда в одном изменении:
// Удали определение $seat-w И все его использования за один раз
```

**Правило:** при рефакторинге SCSS в компоненте — сначала найди все вхождения локальной переменной (`$var`), потом удали/замени их все в одном атомарном изменении файла.

### Правило #12 — Всегда явно импортировать компоненты

В Nuxt 3 auto-import компонентов использует **путь как префикс имени**:
`components/game/PlayerSeat.vue` → авторегистрируется как `<GamePlayerSeat>`, **НЕ** как `<PlayerSeat>`.

Поэтому при использовании компонента под коротким именем (без префикса) — **всегда добавляй явный импорт**:

```typescript
// ❌ WRONG — ожидаешь <PlayerSeat>, Nuxt видит неизвестный тег (рендерит ничего)
// import не написан, расчитываешь на auto-import

// ✅ CORRECT — явный импорт, имя гарантировано
import PlayerSeat from './PlayerSeat.vue'
```

**Чеклист при создании компонента:**
- [ ] Каждый используемый дочерний компонент импортирован явно в `<script setup>`
- [ ] Имя компонента в template совпадает с именем импортированной переменной

# 🏗️ Architecture — PokerArena

## Directory Structure

```
poker-arena/
├── nuxt.config.ts
├── app.vue
├── assets/
│   ├── scss/
│   │   ├── _variables.scss        # Цвета, размеры, breakpoints
│   │   ├── _mixins.scss           # BEM-миксины, media, utils
│   │   ├── _typography.scss       # Шрифты, текстовые стили
│   │   ├── _animations.scss       # Keyframes, transition presets
│   │   ├── _reset.scss            # CSS reset / normalize
│   │   └── main.scss              # Импорт всех partials
│   ├── fonts/                     # Локальные шрифты
│   └── images/
│       ├── cards/                  # SVG карт (52 + рубашка)
│       ├── chips/                  # Фишки разных номиналов
│       └── ui/                     # Иконки, фоны, декор
├── components/
│   ├── game/
│   │   ├── GameTable.vue           # Главный стол — контейнер
│   │   ├── PlayerSeat.vue          # Позиция игрока за столом
│   │   ├── CardHand.vue            # Рука игрока (2 карты)
│   │   ├── CommunityCards.vue      # 5 общих карт
│   │   ├── PotDisplay.vue          # Банк
│   │   ├── DealerButton.vue        # Кнопка дилера
│   │   ├── ActionPanel.vue         # Панель действий (fold/call/raise)
│   │   ├── BetSlider.vue           # Слайдер ставки
│   │   ├── ChipStack.vue           # Визуал стека фишек
│   │   ├── CardFlip.vue            # Одна карта с анимацией flip
│   │   └── Timer.vue               # Таймер хода
│   ├── lobby/
│   │   ├── LobbyLayout.vue         # Layout лобби
│   │   ├── TableList.vue           # Список столов
│   │   ├── TableCard.vue           # Карточка стола
│   │   ├── TableFilters.vue        # Фильтры (stakes, players, type)
│   │   ├── QuickSeat.vue           # Быстрая посадка
│   │   └── OnlinePlayers.vue       # Счётчик онлайн
│   ├── tournament/
│   │   ├── TournamentList.vue      # Список турниров
│   │   ├── TournamentCard.vue      # Карточка турнира
│   │   ├── TournamentBracket.vue   # Сетка / структура
│   │   ├── TournamentLobby.vue     # Лобби конкретного турнира
│   │   ├── BlindSchedule.vue       # Расписание блайндов
│   │   └── PrizePool.vue           # Призовой фонд
│   ├── profile/
│   │   ├── ProfileCard.vue         # Аватар + основная инфо
│   │   ├── StatsOverview.vue       # Общая статистика
│   │   ├── HandHistory.vue         # История рук
│   │   ├── AchievementBadge.vue    # Бейджи / достижения
│   │   └── ChartStats.vue          # Графики (win rate, profit)
│   ├── ui/
│   │   ├── BaseButton.vue          # Кнопка
│   │   ├── BaseModal.vue           # Модалка
│   │   ├── BaseToast.vue           # Уведомления
│   │   ├── BaseAvatar.vue          # Аватар
│   │   ├── BaseBadge.vue           # Бейдж
│   │   ├── BaseLoader.vue          # Спиннер / скелетон
│   │   ├── BaseInput.vue           # Инпут
│   │   ├── BaseDropdown.vue        # Дропдаун
│   │   └── BaseTooltip.vue         # Тултип
│   └── layout/
│       ├── AppHeader.vue           # Шапка
│       ├── AppSidebar.vue          # Сайдбар навигации
│       ├── AppFooter.vue           # Подвал
│       └── NavigationMenu.vue      # Меню
├── composables/
│   ├── useGameEngine.ts            # Логика игрового процесса
│   ├── useCardDeck.ts              # Генерация / шафл колоды
│   ├── useHandEvaluator.ts         # Оценка покерных комбинаций
│   ├── useTimer.ts                 # Таймер хода
│   ├── useChipFormatter.ts         # Форматирование фишек (1k, 1M)
│   └── useAnimationSequence.ts     # Оркестрация анимаций
├── stores/
│   ├── game.ts                     # Состояние игры
│   ├── lobby.ts                    # Столы, фильтры
│   ├── tournament.ts               # Турниры
│   ├── player.ts                   # Текущий игрок, профиль
│   └── ui.ts                       # Модалки, тосты, тема
├── pages/
│   ├── index.vue                   # → Лобби (главная)
│   ├── table/[id].vue              # → Игровой стол
│   ├── tournament/index.vue        # → Список турниров
│   ├── tournament/[id].vue         # → Лобби турнира
│   └── profile/[id].vue            # → Профиль игрока
├── data/
│   └── mock/
│       ├── players.ts              # Мок-игроки (8-10 штук)
│       ├── tables.ts               # Мок-столы
│       ├── tournaments.ts          # Мок-турниры
│       ├── hands.ts                # Мок истории рук
│       └── cards.ts                # Колода, масти, ранги
├── types/
│   ├── game.ts                     # Card, Hand, GameState, Round...
│   ├── player.ts                   # Player, PlayerStats, Seat...
│   ├── table.ts                    # Table, TableConfig, Stakes...
│   ├── tournament.ts               # Tournament, TournamentStatus...
│   └── ui.ts                       # Toast, Modal, Theme...
├── utils/
│   ├── constants.ts                # Магические числа, enum-ы
│   ├── formatters.ts               # Деньги, даты, числа
│   └── helpers.ts                  # Общие утилиты
└── plugins/
    └── gsap.client.ts              # GSAP (client-only)
```

## Component Architecture

### Game Table — иерархия

```
GameTable.vue (контейнер стола)
├── DealerButton.vue
├── PotDisplay.vue
├── CommunityCards.vue
│   └── CardFlip.vue × 5
├── PlayerSeat.vue × 9  (макс. позиций)
│   ├── BaseAvatar.vue
│   ├── CardHand.vue
│   │   └── CardFlip.vue × 2
│   ├── ChipStack.vue
│   └── Timer.vue (для активного игрока)
└── ActionPanel.vue (только для hero)
    └── BetSlider.vue
```

### Позиции игроков за столом

```
        [Seat 1]    [Seat 2]    [Seat 3]
   [Seat 0]                          [Seat 4]
   [Seat 8]                          [Seat 5]
        [Seat 7]    [Seat 6 — HERO]
```

Hero всегда на Seat 6 (bottom center). Позиции рассчитываются через CSS `--seat-index`.

## Pinia Stores — ответственность

### `game.ts`
- `gameState`: preflop | flop | turn | river | showdown
- `pot`, `sidePots`
- `communityCards`, `deck`
- `seats[]` — кто где сидит
- `currentPlayerIndex`, `dealerIndex`
- `actions`: fold / check / call / raise / all-in
- `roundHistory`

### `lobby.ts`
- `tables[]` — доступные столы
- `filters` — stakes, type, playerCount
- `sortBy` — по кол-ву игроков, stakes, etc.

### `tournament.ts`
- `tournaments[]`
- `currentTournament`
- `blindSchedule`
- `standings`

### `player.ts`
- `currentPlayer` — hero
- `bankroll`, `stats`
- `handHistory[]`
- `achievements[]`

### `ui.ts`
- `activeModal`, `toasts[]`
- `theme`: dark | light
- `soundEnabled`

## Mock Data Strategy

Все моки лежат в `/data/mock/` и экспортируют типизированные массивы. Никаких API-вызовов. Composables читают из сторов, сторы инициализируются моками.

**Поток данных:**
```
mock/*.ts → stores (Pinia) → composables → components
```

## Design Tokens

Основные цвета (тёмная тема по умолчанию):

```scss
// Основа
$color-bg-primary: #0d1117;        // Фон приложения
$color-bg-secondary: #161b22;      // Карточки, панели
$color-bg-table: #1a472a;          // Сукно стола (тёмный зелёный)
$color-bg-table-felt: #2d6a3f;     // Сукно акцент

// Текст
$color-text-primary: #e6edf3;
$color-text-secondary: #8b949e;
$color-text-accent: #f0c040;       // Золото (фишки, выигрыш)

// Акценты
$color-accent-gold: #f0c040;
$color-accent-red: #e74c3c;        // Черви, бубны
$color-accent-green: #2ecc71;      // Call, Win
$color-accent-blue: #3498db;       // Info, links

// Масти
$color-suit-hearts: #e74c3c;
$color-suit-diamonds: #e74c3c;
$color-suit-clubs: #e6edf3;
$color-suit-spades: #e6edf3;

// Фишки
$color-chip-white: #f5f5f5;        // 1
$color-chip-red: #e74c3c;          // 5
$color-chip-blue: #3498db;         // 10
$color-chip-green: #2ecc71;        // 25
$color-chip-black: #2c3e50;        // 100
$color-chip-purple: #9b59b6;       // 500
$color-chip-gold: #f0c040;         // 1000
```

## Typography

```scss
$font-display: 'Bebas Neue', sans-serif;    // Заголовки, pot, крупные числа
$font-body: 'DM Sans', sans-serif;          // Основной текст
$font-mono: 'JetBrains Mono', monospace;    // Числа в статах, таймер
```

## Responsive Breakpoints

```scss
$breakpoint-mobile: 480px;
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;
$breakpoint-wide: 1440px;
```

Стол оптимизирован под desktop-first, но адаптируется до tablet (portrait = stack layout).

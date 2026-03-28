# 📋 Task History — PokerArena

> Лог всех выполненных тасков. Каждый AI-агент ОБЯЗАН добавить запись после завершения таска.

## Format

```markdown
### TASK_ID: Краткое название
- **Date**: YYYY-MM-DD
- **Phase**: N
- **Status**: ✅ Done | ⚠️ Partial
- **Files changed/created**:
  - `path/to/file.vue` — что сделано
  - `path/to/file.ts` — что сделано
- **Decisions made**: ключевые решения, которые влияют на будущие таски
- **Known issues**: проблемы, если есть
- **Next recommended task**: TASK_ID
```

---

## History

<!-- 
Пример записи:

### P1-T01: Nuxt 3 scaffold
- **Date**: 2026-03-29
- **Phase**: 1
- **Status**: ✅ Done
- **Files changed/created**:
  - `nuxt.config.ts` — base config with SCSS, TypeScript strict
  - `app.vue` — root component with NuxtLayout
  - `tsconfig.json` — strict mode enabled
  - `package.json` — deps: pinia, sass, gsap
- **Decisions made**: 
  - Используем `sass` (не `node-sass`)
  - GSAP подключаем как client-only plugin
- **Known issues**: нет
- **Next recommended task**: P1-T02
-->

### P1-T01: Nuxt 3 scaffold + TS strict + SCSS foundation
- **Date**: 2026-03-28
- **Phase**: 1
- **Status**: ✅ Done
- **Files changed/created**:
  - `package.json` — nuxt 3.11, pinia, gsap, sass, typescript deps
  - `nuxt.config.ts` — SCSS additionalData (variables + mixins auto-injected), @pinia/nuxt module, Google Fonts (Bebas Neue, DM Sans, JetBrains Mono)
  - `tsconfig.json` — strict mode + noUncheckedIndexedAccess + exactOptionalPropertyTypes
  - `app.vue` — root с NuxtLayout + NuxtPage, data-theme="dark"
  - `layouts/default.vue` — базовый layout
  - `pages/index.vue` — placeholder страница лобби
  - `assets/scss/_variables.scss` — все design tokens (цвета, типографика, спейсинг, бордеры, тени, z-index, переходы, breakpoints, card/table размеры)
  - `assets/scss/_mixins.scss` — respond-to, flex-center/between/column, absolute-fill/center, text-ellipsis, card-base, chip-color, glow, glass, hover-lift, focus-ring, custom-scrollbar
  - `assets/scss/_reset.scss` — CSS normalize/reset
  - `assets/scss/_typography.scss` — utility классы для шрифтов и цветов
  - `assets/scss/_animations.scss` — keyframes (fade, card-deal, card-flip, chip-fly, pulse-glow, timer-drain) + utility классы
  - `assets/scss/main.scss` — импорт всех partials, глобальные стили body/selection/scrollbar
  - `plugins/gsap.client.ts` — GSAP как client-only Nuxt plugin
  - `.gitignore` — node_modules, .nuxt, .output, .env
- **Decisions made**:
  - `sass` пакет (не `node-sass` — устарел)
  - GSAP подключён через `plugins/gsap.client.ts` (client-only, избегаем SSR-проблем)
  - variables и mixins auto-inject через `vite.css.preprocessorOptions.scss.additionalData` — не нужно `@use` в каждом компоненте
  - `chip-color` mixin использует `color-mix()` вместо deprecated `darken()` из sass
  - Fonts через Google Fonts CDN (не локально) для быстрого старта
  - P1-T02 считается выполненным — SCSS foundation создана в рамках P1-T01
- **Known issues**: нет
- **Next recommended task**: P1-T03 (UI Kit: BaseButton, BaseModal, BaseInput, BaseAvatar)

---

### P1-T03: UI Kit — BaseButton, BaseModal, BaseInput, BaseAvatar
- **Date**: 2026-03-28
- **Phase**: 1
- **Status**: ✅ Done
- **Files changed/created**:
  - `components/ui/BaseButton.vue` — варианты primary/secondary/danger/ghost, размеры sm/md/lg, состояния disabled/loading со спиннером
  - `components/ui/BaseModal.vue` — Teleport to body, backdrop click + Escape закрывают, слоты header/body/footer, transition анимация
  - `components/ui/BaseInput.vue` — v-model, label, placeholder, error/hint, prefix/suffix слоты, размеры sm/md/lg, состояния focused/error/disabled
  - `components/ui/BaseAvatar.vue` — src с fallback на инициалы, цвет фона из имени (детерминированный хэш), размеры xs-xl, online-dot, варианты circle/rounded
- **Decisions made**:
  - BaseModal использует `Teleport to="body"` — избегаем z-index проблем внутри вложенных stacking contexts
  - Цвет fallback-аватара генерируется детерминированно из имени (hash) — один игрок всегда одного цвета
  - BaseInput хранит `isFocused` локально для border highlight без лишних emit
  - `color-mix()` используется для hover-эффектов (уже установлено в P1-T01)
- **Known issues**: нет
- **Next recommended task**: P1-T04 (BaseToast, BaseBadge, BaseLoader, BaseTooltip)

---

### P1-T04: UI Kit — BaseToast, BaseBadge, BaseLoader, BaseTooltip
- **Date**: 2026-03-28
- **Phase**: 1
- **Status**: ✅ Done
- **Files changed/created**:
  - `components/ui/BaseToast.vue` — success/error/warning/info типы, progress bar с таймером, enter/exit анимация, emit close по id
  - `components/ui/BaseBadge.vue` — 6 вариантов цвета, solid/outline режимы, dot-режим (без текста), размеры sm/md
  - `components/ui/BaseLoader.vue` — 3 варианта: spinner (css rotate), dots (bounce анимация), skeleton (shimmer gradient); размеры sm/md/lg; цвета gold/white/muted
  - `components/ui/BaseTooltip.vue` — чисто CSS позиционирование, 4 placement (top/bottom/left/right), стрелка через ::after, hover + focus-within триггер, prop disabled
- **Decisions made**:
  - BaseToast не управляет своим стеком — это задача stores/ui.ts (ToastContainer будет рендерить массив toasts[])
  - BaseTooltip использует CSS-only позиционирование (без JS/Popper) — достаточно для покерного UI, нет overflow-проблем на столе
  - BaseLoader skeleton использует `background-size: 200%` shimmer — совместимо без доп. зависимостей
  - BaseBadge использует `!important` только в outline-модификаторе для переопределения background варианта — единственный допустимый случай по RULES.md
- **Known issues**: нет
- **Next recommended task**: P1-T05 (Layout: AppHeader, AppSidebar, AppFooter)

---

### P1-T05: Layout — AppHeader, AppSidebar, AppFooter
- **Date**: 2026-03-28
- **Phase**: 1
- **Status**: ✅ Done
- **Files changed/created**:
  - `components/layout/AppHeader.vue` — sticky header, logo, nav links с active state, bankroll + deposit, level badge, avatar
  - `components/layout/AppSidebar.vue` — collapsible (v-model:collapsed), nav links, секция «Мои столы» с mock данными, плавная анимация toggle
  - `components/layout/AppFooter.vue` — copyright, links, online counter (mock)
  - `layouts/default.vue` — обновлён: AppHeader + AppSidebar + slot(main) + AppFooter, flex-column структура
- **Decisions made**:
  - Hero данные и active tables в header/sidebar — пока mock-константы, будут заменены на stores/player.ts и stores/lobby.ts в P1-T06
  - Sidebar collapse через `v-model:collapsed` (emit update:collapsed) — стандартный Vue pattern
  - AppSidebar — `overflow: hidden` + transition на `width` для плавного collapse без JS измерений
  - default.vue использует `flex: 1; min-height: 0` на body для корректного scroll внутри main без overflow на всей странице
- **Known issues**: нет
- **Next recommended task**: P1-T06 (Pinia stores scaffold)

---

### P1-T06: Pinia Stores scaffold + Types
- **Date**: 2026-03-28
- **Phase**: 1
- **Status**: ✅ Done
- **Files changed/created**:
  - `types/game.ts` — Suit, Rank, Card, GamePhase, PlayerAction, SeatStatus, SidePot, SeatState, ActionRecord, GameState
  - `types/player.ts` — PlayerLevel, PlayerStats, HandHistoryEntry, Achievement, Player
  - `types/table.ts` — TableType, TableSpeed, TableStatus, Stakes, TableConfig, Table
  - `types/tournament.ts` — TournamentStatus, TournamentType, BlindLevel, PrizeEntry, TournamentStanding, Tournament
  - `types/ui.ts` — ToastType, Theme, ModalId, Toast
  - `stores/game.ts` — gameState, phase, pot, sidePots, communityCards, deck, seats, actions: recordAction/addToPot/revealCommunityCard/advanceCurrentSeat/resetRound
  - `stores/lobby.ts` — tables, filters (type/speed/blinds/players), sortBy, getters: filteredTables/selectedTable
  - `stores/tournament.ts` — tournaments, currentTournamentId, filters, getters: filteredTournaments/currentTournament/standings, tickNextLevel
  - `stores/player.ts` — currentPlayer, bankroll, stats, handHistory, achievements, addHandHistory, unlockAchievement
  - `stores/ui.ts` — theme, activeModal, modalPayload, toasts, soundEnabled, sidebarCollapsed, showToast/removeToast (auto-timeout)
- **Decisions made**:
  - Types созданы одновременно с сторами — P1-T07 считается выполненным в рамках P1-T06
  - `showToast` в ui.ts автоматически вызывает setTimeout + removeToast — компонент ToastContainer просто рендерит массив
  - `modalPayload: Record<string, unknown>` — гибкий способ передавать данные в модалки без типовых коллизий
  - `advanceCurrentSeat` пропускает folded/all-in/empty сиденья — готово для game engine
  - Lobby и Tournament filters используют generic `setFilter<K>` action — не нужно action на каждый фильтр
- **Known issues**: нет
- **Next recommended task**: P1-T08 (Mock data: players, tables, tournaments)

---

### P1-T08: Mock data — players, tables, tournaments, hands, cards
- **Date**: 2026-03-28
- **Phase**: 1
- **Status**: ✅ Done
- **Files changed/created**:
  - `data/mock/cards.ts` — SUITS, RANKS, RANK_VALUES, SUIT_SYMBOLS, buildDeck(), shuffleDeck(), FULL_DECK
  - `data/mock/players.ts` — MOCK_HERO (hero player) + 8 opponent players с реалистичной статистикой (VPIP/PFR/winRate)
  - `data/mock/tables.ts` — 8 столов: micro/mid/high stakes, normal/fast/turbo speed, 2/6/9 max players
  - `data/mock/tournaments.ts` — 6 турниров: registering/running/finished, freezeout/bounty/rebuy, freeroll до $1000 buy-in; STANDARD_BLINDS и TURBO_BLINDS структуры
  - `data/mock/hands.ts` — 10 записей истории рук для hero: won/lost/folded, разные фазы и столы
- **Decisions made**:
  - TURBO_BLINDS — деривированы из STANDARD_BLINDS через map (длительность / 2), минимум 5 минут
  - heroCards/communityCards в hands.ts хранятся как строки `'suit-rank'` (Card.id формат) — для связки с buildDeck()
  - MOCK_HERO.handHistory = [] — реальная история подключается из hands.ts в store init (P1-T09 или плагин)
- **Known issues**: нет
- **Next recommended task**: P1-T09 (Routing: все pages с placeholder контентом)

---

### P1-T09: Routing — все pages с placeholder контентом
- **Date**: 2026-03-28
- **Phase**: 1
- **Status**: ✅ Done
- **Files changed/created**:
  - `pages/index.vue` — обновлён: инициализация lobbyStore + playerStore из моков в onMounted, список столов с NuxtLink → /table/[id]
  - `pages/table/[id].vue` — страница стола: читает table из lobbyStore по route.params.id, зелёное "сукно" placeholder, gameStore.$reset() в onUnmounted
  - `pages/tournament/index.vue` — список турниров: инициализация tournamentStore, список с NuxtLink → /tournament/[id], статус с цветом
  - `pages/tournament/[id].vue` — детальная страница турнира: info, blind schedule таблица, standings; setCurrentTournament в onMounted/onUnmounted
  - `pages/profile/[id].vue` — профиль игрока: id='me' → hero, иначе поиск в MOCK_PLAYERS; stats, bankroll, achievements, hand history
- **Decisions made**:
  - Инициализация сторов из моков происходит в onMounted каждой страницы (идемпотентно — не перезаписывает если уже загружено)
  - profile/[id].vue поддерживает id='me' как алиас для hero — удобно для навигации из header
  - table/[id].vue вызывает gameStore.$reset() при unmount — чистим состояние игры при выходе со стола
  - Все страницы используют layout: 'default'
- **Known issues**: нет
- **Next recommended task**: P1-T10 (Dark theme + CSS custom properties)

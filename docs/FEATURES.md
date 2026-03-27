# 🎯 Features — PokerArena

## Feature Status Legend

| Symbol | Meaning           |
|--------|--------------------|
| ⬜     | Not started        |
| 🔨     | In progress        |
| ✅     | Done               |
| 🚫     | Blocked            |
| 💡     | Future / nice-to-have |

---

## PHASE 1 — Foundation (Инфраструктура + UI Kit)

> Цель: рабочий Nuxt-проект, базовые компоненты, SCSS-система, моки

| ID     | Feature                              | Status | Priority |
|--------|--------------------------------------|--------|----------|
| P1-T01 | Nuxt 3 scaffold + конфиг TS + SCSS  | ⬜     | 🔴 HIGH  |
| P1-T02 | SCSS foundation: variables, mixins, reset, typography | ⬜ | 🔴 HIGH |
| P1-T03 | UI Kit: BaseButton, BaseModal, BaseInput, BaseAvatar | ⬜ | 🔴 HIGH |
| P1-T04 | UI Kit: BaseToast, BaseBadge, BaseLoader, BaseTooltip | ⬜ | 🟡 MED |
| P1-T05 | Layout: AppHeader, AppSidebar, AppFooter | ⬜ | 🔴 HIGH |
| P1-T06 | Pinia stores: скаффолд всех сторов  | ⬜     | 🔴 HIGH  |
| P1-T07 | Types: все интерфейсы и типы         | ⬜     | 🔴 HIGH  |
| P1-T08 | Mock data: players, tables, tournaments | ⬜  | 🔴 HIGH  |
| P1-T09 | Routing: все pages с placeholder     | ⬜     | 🟡 MED   |
| P1-T10 | Dark theme + CSS custom properties   | ⬜     | 🟡 MED   |

---

## PHASE 2 — Game Table (Стол + игровая механика)

> Цель: рабочий стол с позициями, картами, анимациями и action panel

| ID     | Feature                              | Status | Priority |
|--------|--------------------------------------|--------|----------|
| P2-T01 | GameTable layout: овальный стол с позициями | ⬜ | 🔴 HIGH |
| P2-T02 | PlayerSeat: аватар, ник, стек, статус | ⬜    | 🔴 HIGH  |
| P2-T03 | Card system: SVG карты + CardFlip анимация | ⬜ | 🔴 HIGH |
| P2-T04 | CardHand: рука игрока (2 карты, peek для hero) | ⬜ | 🔴 HIGH |
| P2-T05 | CommunityCards: 5 карт с поэтапным открытием | ⬜ | 🔴 HIGH |
| P2-T06 | PotDisplay: банк с анимацией роста   | ⬜     | 🟡 MED   |
| P2-T07 | DealerButton: позиция + анимация перемещения | ⬜ | 🟡 MED |
| P2-T08 | ActionPanel: fold/check/call/raise кнопки | ⬜ | 🔴 HIGH |
| P2-T09 | BetSlider: слайдер + быстрые кнопки (1/2 pot, pot, all-in) | ⬜ | 🟡 MED |
| P2-T10 | ChipStack: визуал стека фишек у игрока | ⬜   | 🟢 LOW   |
| P2-T11 | Timer: обратный отсчёт хода с визуалом | ⬜   | 🟡 MED   |
| P2-T12 | Game Engine composable: управление фазами | ⬜ | 🔴 HIGH |
| P2-T13 | Deal animation: раздача карт от дилера | ⬜   | 🟡 MED   |
| P2-T14 | Bet animation: фишки летят в пот     | ⬜     | 🟢 LOW   |
| P2-T15 | Win animation: подсветка победителя + пот | ⬜ | 🟢 LOW   |
| P2-T16 | Hand evaluator: определение комбинаций | ⬜   | 🔴 HIGH  |

---

## PHASE 3 — Lobby (Лобби + столы)

> Цель: главная страница со списком столов, фильтрами, быстрой посадкой

| ID     | Feature                              | Status | Priority |
|--------|--------------------------------------|--------|----------|
| P3-T01 | LobbyLayout: grid/list view toggle  | ⬜     | 🔴 HIGH  |
| P3-T02 | TableCard: карточка стола (stakes, players, type) | ⬜ | 🔴 HIGH |
| P3-T03 | TableFilters: фильтры по stakes, кол-ву игроков | ⬜ | 🟡 MED |
| P3-T04 | TableList: сортировка и пагинация    | ⬜     | 🟡 MED   |
| P3-T05 | QuickSeat: кнопка быстрой посадки    | ⬜     | 🟡 MED   |
| P3-T06 | OnlinePlayers: счётчик онлайн (мок)  | ⬜     | 🟢 LOW   |
| P3-T07 | Table preview: мини-превью стола в карточке | ⬜ | 🟢 LOW  |

---

## PHASE 4 — Profile & Stats (Профиль игрока)

> Цель: страница профиля с аватаром, статами, историей рук, достижениями

| ID     | Feature                              | Status | Priority |
|--------|--------------------------------------|--------|----------|
| P4-T01 | ProfileCard: аватар, ник, уровень, bankroll | ⬜ | 🔴 HIGH |
| P4-T02 | StatsOverview: win rate, hands played, profit | ⬜ | 🔴 HIGH |
| P4-T03 | ChartStats: графики profit/loss over time | ⬜ | 🟡 MED  |
| P4-T04 | HandHistory: список сыгранных рук    | ⬜     | 🟡 MED   |
| P4-T05 | Hand replay: визуальный повтор руки  | ⬜     | 🟢 LOW   |
| P4-T06 | AchievementBadge: бейджи и достижения | ⬜    | 🟢 LOW   |
| P4-T07 | Avatar picker: выбор аватара из набора | ⬜   | 🟢 LOW   |

---

## PHASE 5 — Tournaments (Турнирная система)

> Цель: список турниров, лобби турнира, блайнд-структура, призы

| ID     | Feature                              | Status | Priority |
|--------|--------------------------------------|--------|----------|
| P5-T01 | TournamentList: список с фильтрами   | ⬜     | 🔴 HIGH  |
| P5-T02 | TournamentCard: buy-in, prize pool, status | ⬜ | 🔴 HIGH |
| P5-T03 | TournamentLobby: инфо + список участников | ⬜ | 🔴 HIGH |
| P5-T04 | BlindSchedule: таблица уровней блайндов | ⬜  | 🟡 MED   |
| P5-T05 | PrizePool: структура призового фонда | ⬜     | 🟡 MED   |
| P5-T06 | TournamentBracket: визуальная сетка  | ⬜     | 🟢 LOW   |
| P5-T07 | Tournament timer: отсчёт до следующего уровня | ⬜ | 🟡 MED |
| P5-T08 | Registration flow: регистрация / отмена | ⬜  | 🟡 MED   |

---

## PHASE 6 — Polish & UX

> Цель: анимации, звуки, адаптивность, мелкие улучшения

| ID     | Feature                              | Status | Priority |
|--------|--------------------------------------|--------|----------|
| P6-T01 | Sound effects: карты, фишки, таймер  | 💡     | 🟢 LOW   |
| P6-T02 | Keyboard shortcuts: space=check, f=fold | 💡  | 🟢 LOW   |
| P6-T03 | Table chat: мок-чат за столом        | 💡     | 🟢 LOW   |
| P6-T04 | Emojis / reactions за столом         | 💡     | 🟢 LOW   |
| P6-T05 | Responsive: tablet layout            | 💡     | 🟡 MED   |
| P6-T06 | Loading states: скелетоны всех страниц | 💡   | 🟢 LOW   |
| P6-T07 | Error states: пустые списки, ошибки  | 💡     | 🟢 LOW   |
| P6-T08 | Page transitions: анимации переходов | 💡     | 🟢 LOW   |
| P6-T09 | Light theme toggle                   | 💡     | 🟢 LOW   |

---

## Summary

| Phase   | Total Tasks | HIGH | MED | LOW |
|---------|-------------|------|-----|-----|
| Phase 1 | 10          | 6    | 3   | 1   |
| Phase 2 | 16          | 6    | 5   | 5   |
| Phase 3 | 7           | 2    | 3   | 2   |
| Phase 4 | 7           | 2    | 2   | 3   |
| Phase 5 | 8           | 3    | 3   | 2   |
| Phase 6 | 9           | 0    | 1   | 8   |
| **Total** | **57**    | **19** | **17** | **21** |

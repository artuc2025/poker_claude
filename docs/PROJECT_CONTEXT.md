# 🃏 PokerArena — Project Context

## Overview

**PokerArena** — фронтенд-приложение для онлайн-покера (Texas Hold'em) на Nuxt 3 + TypeScript + SCSS (BEM). Все данные — mock. Бэкенда нет. Цель — полноценный UI/UX покерного клиента с анимациями, лобби, профилями и турнирами.

## Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Framework     | Nuxt 3 (Vue 3 Composition API)     |
| Language      | TypeScript (strict mode)            |
| Styling       | SCSS + BEM methodology              |
| State         | Pinia                               |
| Animations    | CSS transitions + GSAP (опционально)|
| Icons         | Lucide или custom SVG               |
| Fonts         | Custom (см. ARCHITECTURE.md)        |
| Mock Data     | `/data/mock/` — JSON/TS файлы      |
| Testing       | Vitest + Vue Test Utils (позже)     |

## Project Status

> **Обновляй эту секцию после каждого завершённого таска!**

### Current Phase: `PHASE_1 — Foundation`

### Completed Tasks
<!-- Формат: - [x] TASK_ID: краткое описание (дата) -->
- [x] P1-T01: Nuxt 3 scaffold + TS strict + SCSS foundation (2026-03-28)
- [x] P1-T02: SCSS foundation — выполнено в рамках P1-T01 (2026-03-28)
- [x] P1-T03: UI Kit: BaseButton, BaseModal, BaseInput, BaseAvatar (2026-03-28)
- [x] P1-T04: UI Kit: BaseToast, BaseBadge, BaseLoader, BaseTooltip (2026-03-28)

### Current Task
<!-- Формат: - [ ] TASK_ID: описание -->
- [ ] P1-T05: Layout: AppHeader, AppSidebar, AppFooter

### Blocked / Issues
<!-- Формат: - ⚠️ описание проблемы -->

## How to Use This Context (для AI-агента)

1. **ВСЕГДА** начинай новый чат с чтения этого файла
2. Прочитай `ARCHITECTURE.md` для понимания структуры
3. Прочитай `RULES.md` для code conventions
4. Посмотри `FEATURES.md` чтобы понять scope
5. Посмотри `TASK_HISTORY.md` чтобы понять что уже сделано
6. Выполни **один** таск из текущей фазы
7. **Обнови** `PROJECT_CONTEXT.md` (status) и `TASK_HISTORY.md` (лог)
8. Верни пользователю обновлённые файлы

## File Map

```
docs/
├── PROJECT_CONTEXT.md    ← ТЫ ЗДЕСЬ. Точка входа.
├── ARCHITECTURE.md       ← Структура проекта, компоненты, сторы
├── RULES.md              ← Code conventions, BEM, TypeScript, SCSS
├── FEATURES.md           ← Все фичи с приоритетами и статусами
├── TASK_HISTORY.md       ← Лог выполненных тасков
└── PROMPT_TEMPLATES.md   ← Готовые промпты для каждого типа таска
```

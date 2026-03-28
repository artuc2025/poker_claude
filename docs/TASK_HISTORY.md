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

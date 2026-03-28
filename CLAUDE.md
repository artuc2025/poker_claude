# Project Context

При старте каждой сессии прочитай эти файлы по порядку:

1. PROJECT_CONTEXT.md
2. ARCHITECTURE.md
3. RULES.md
4. FEATURES.md
5. TASK_HISTORY.md

После прочтения подтверди что понял контекст и скажи: текущая фаза и следующий таск.

## CODE REVIEW (every 5 tasks)

Run full code review on all changes made in the last 5 tasks.

**Stack:** Nuxt 3, Vue 3, TypeScript, SCSS

**Check in this order:**

1. ARCHITECTURE — composables vs components split, feature folder structure,
   no logic in pages, proper use of layouts/plugins
2. PERFORMANCE — no unnecessary re-renders, lazy loading, no heavy ops in templates,
   proper async/await, no memory leaks in onMounted/onUnmounted
3. SECURITY — no sensitive data in client, proper input validation,
   no XSS vectors in v-html, API keys not exposed
4. CODE STYLE — strict TypeScript (no `any`), SCSS BEM or agreed convention,
   named exports, composables start with `use`, no magic numbers

**Output format — sorted by priority:**

🔴 CRITICAL — must fix before next task
🟡 WARNING — fix soon, tech debt risk  
🟢 SUGGESTION — improvement, not blocking

**For each issue:**

- File + line
- What's wrong
- How to fix (short)

**End with:**

- Overall health score: X/10
- Top 1 thing to fix first

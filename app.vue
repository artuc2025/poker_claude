<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

useHead({
  htmlAttrs: {
    lang: 'en',
    'data-theme': computed(() => uiStore.theme),
  },
})
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: $font-body;
}
</style>

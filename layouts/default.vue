<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const sidebarCollapsed = ref(false)
</script>

<template>
  <div class="default-layout">
    <AppHeader />

    <div class="default-layout__body">
      <AppSidebar v-model:collapsed="sidebarCollapsed" />

      <main class="default-layout__main">
        <slot />
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: $color-bg-primary;

  &__body {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  &__main {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    @include custom-scrollbar;
  }
}
</style>

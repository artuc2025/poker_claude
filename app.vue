<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
    'data-theme': 'dark',
  },
})
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  background: $color-bg-primary;
  color: $color-text-primary;
  font-family: $font-body;
}
</style>

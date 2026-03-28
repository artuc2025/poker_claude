<template>
  <div class="default-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.default-layout {
  min-height: 100vh;
  background: $color-bg-primary;
}
</style>

<template>
  <div class="lobby-page">
    <p class="lobby-page__placeholder">Lobby — coming soon (P3)</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<style lang="scss" scoped>
.lobby-page {
  @include flex-center;
  min-height: 100vh;

  &__placeholder {
    color: $color-text-secondary;
    font-size: $font-size-lg;
  }
}
</style>

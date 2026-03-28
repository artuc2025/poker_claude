<script setup lang="ts">
// 1. Props
const props = withDefaults(defineProps<{
  src?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  online?: boolean
  variant?: 'circle' | 'rounded'
}>(), {
  size: 'md',
  online: false,
  variant: 'circle',
})

// 2. Computed
const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
})

const avatarColor = computed(() => {
  if (!props.name) return '#3498db'
  const colors = [
    '#e74c3c', '#e67e22', '#f0c040', '#2ecc71',
    '#3498db', '#9b59b6', '#1abc9c', '#e91e63',
  ]
  let hash = 0
  for (let i = 0; i < props.name.length; i++) {
    hash = props.name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length] as string
})

const classes = computed(() => [
  'base-avatar',
  `base-avatar--${props.size}`,
  `base-avatar--${props.variant}`,
  { 'base-avatar--online': props.online },
])

// 3. State
const imgError = ref(false)

function onImgError() {
  imgError.value = true
}
</script>

<template>
  <div :class="classes">
    <img
      v-if="src && !imgError"
      class="base-avatar__img"
      :src="src"
      :alt="name ?? 'Avatar'"
      draggable="false"
      @error="onImgError"
    />
    <div
      v-else
      class="base-avatar__fallback"
      :style="{ '--avatar-bg': avatarColor }"
      aria-hidden="true"
    >
      {{ initials }}
    </div>
    <span v-if="online" class="base-avatar__online-dot" />
  </div>
</template>

<style lang="scss" scoped>
.base-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);

  // --- Sizes ---
  &--xs { width: 24px; height: 24px; font-size: 10px;
    .base-avatar__online-dot { width: 6px;  height: 6px;  } }
  &--sm { width: 32px; height: 32px; font-size: 12px;
    .base-avatar__online-dot { width: 8px;  height: 8px;  } }
  &--md { width: 40px; height: 40px; font-size: 14px;
    .base-avatar__online-dot { width: 10px; height: 10px; } }
  &--lg { width: 56px; height: 56px; font-size: 18px;
    .base-avatar__online-dot { width: 12px; height: 12px; } }
  &--xl { width: 80px; height: 80px; font-size: 26px;
    .base-avatar__online-dot { width: 14px; height: 14px; } }

  // --- Variants ---
  &--circle { border-radius: 50%; }
  &--rounded { border-radius: $border-radius-md; }

  // --- Parts ---
  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__fallback {
    @include flex-center;
    width: 100%;
    height: 100%;
    background: var(--avatar-bg);
    font-family: $font-body;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.03em;
    user-select: none;
  }

  &__online-dot {
    position: absolute;
    bottom: 0;
    right: 0;
    border-radius: 50%;
    background: $color-accent-green;
    border: 2px solid var(--color-bg-primary);
    box-shadow: 0 0 6px rgba($color-accent-green, 0.6);
  }
}
</style>

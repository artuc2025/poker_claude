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
      :style="{ background: avatarColor }"
      aria-hidden="true"
    >
      {{ initials }}
    </div>
    <span v-if="online" class="base-avatar__online-dot" />
  </div>
</template>

<style lang="scss" scoped>
$avatar-sizes: (
  'xs': 24px,
  'sm': 32px,
  'md': 40px,
  'lg': 56px,
  'xl': 80px,
);

$font-sizes: (
  'xs': 10px,
  'sm': 12px,
  'md': 14px,
  'lg': 18px,
  'xl': 26px,
);

$dot-sizes: (
  'xs': 6px,
  'sm': 8px,
  'md': 10px,
  'lg': 12px,
  'xl': 14px,
);

.base-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  background: $color-bg-secondary;
  border: 1px solid $color-border;

  // --- Sizes ---
  @each $name, $size in $avatar-sizes {
    &--#{$name} {
      width: $size;
      height: $size;
      font-size: map-get($font-sizes, $name);

      .base-avatar__online-dot {
        $dot: map-get($dot-sizes, $name);
        width: $dot;
        height: $dot;
      }
    }
  }

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
    border: 2px solid $color-bg-primary;
    box-shadow: 0 0 6px rgba($color-accent-green, 0.6);
  }
}
</style>

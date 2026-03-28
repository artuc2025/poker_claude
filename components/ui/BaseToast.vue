<script setup lang="ts">
// Single toast item component.
// Usage: rendered by ToastContainer (stores/ui.ts → toasts[])

// 1. Props & Emits
const props = withDefaults(defineProps<{
  id: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number // ms, 0 = persistent
}>(), {
  type: 'info',
  duration: 3500,
})

const emit = defineEmits<{
  close: [id: string]
}>()

// 2. State
const visible = ref(false)
const progressWidth = ref(100)

let progressInterval: ReturnType<typeof setInterval> | null = null
let closeTimeout: ReturnType<typeof setTimeout> | null = null

// 3. Icons per type
const icons: Record<string, string> = {
  success: 'M5 13l4 4L19 7',
  error: 'M6 18L18 6M6 6l12 12',
  warning: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

const iconPath = computed(() => icons[props.type] ?? icons['info'])

// 4. Lifecycle
onMounted(() => {
  // Trigger enter animation on next tick
  requestAnimationFrame(() => { visible.value = true })

  if (props.duration > 0) {
    const step = 100 / (props.duration / 50)
    progressInterval = setInterval(() => {
      progressWidth.value = Math.max(0, progressWidth.value - step)
    }, 50)

    closeTimeout = setTimeout(() => dismiss(), props.duration)
  }
})

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval)
  if (closeTimeout) clearTimeout(closeTimeout)
})

function dismiss() {
  visible.value = false
  setTimeout(() => emit('close', props.id), 300)
}
</script>

<template>
  <div
    :class="['base-toast', `base-toast--${type}`, { 'base-toast--visible': visible }]"
    role="alert"
    aria-live="polite"
  >
    <div class="base-toast__icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path :d="iconPath" />
      </svg>
    </div>

    <span class="base-toast__message">{{ message }}</span>

    <button class="base-toast__close" aria-label="Закрыть" @click="dismiss">
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>

    <div v-if="duration > 0" class="base-toast__progress">
      <div class="base-toast__progress-bar" :style="{ width: `${progressWidth}%` }" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$toast-colors: (
  'success': $color-accent-green,
  'error':   $color-accent-red,
  'warning': $color-accent-gold,
  'info':    $color-accent-blue,
);

.base-toast {
  position: relative;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  overflow: hidden;

  min-width: 280px;
  max-width: 400px;
  padding: $spacing-sm $spacing-md;

  background: $color-bg-secondary;
  border: 1px solid $color-border;
  border-left-width: 3px;
  border-radius: $border-radius-md;
  box-shadow: $shadow-lg;

  // Enter animation
  opacity: 0;
  transform: translateX(16px);
  transition: opacity 0.25s ease, transform 0.25s ease;

  &--visible {
    opacity: 1;
    transform: translateX(0);
  }

  @each $type, $color in $toast-colors {
    &--#{$type} {
      border-left-color: $color;

      .base-toast__icon { color: $color; }
      .base-toast__progress-bar { background: $color; }
    }
  }

  &__icon {
    @include flex-center;
    flex-shrink: 0;
  }

  &__message {
    flex: 1;
    font-family: $font-body;
    font-size: 13px;
    color: $color-text-primary;
    line-height: 1.4;
  }

  &__close {
    @include flex-center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border: none;
    border-radius: $border-radius-sm;
    background: transparent;
    color: $color-text-secondary;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover { background: rgba(255, 255, 255, 0.08); }
  }

  &__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.08);
  }

  &__progress-bar {
    height: 100%;
    transition: width 50ms linear;
  }
}
</style>

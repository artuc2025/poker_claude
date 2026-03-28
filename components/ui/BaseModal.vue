<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

// 1. Props & Emits
const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
  closable?: boolean
}>(), {
  size: 'md',
  closable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

// 2. Methods
function close() {
  if (!props.closable) return
  emit('update:modelValue', false)
  emit('close')
}

function onBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    close()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

// 3. Lifecycle
onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="base-modal"
        role="dialog"
        aria-modal="true"
        @click="onBackdropClick"
      >
        <div :class="['base-modal__dialog', `base-modal__dialog--${size}`]">
          <div v-if="title || closable || $slots.header" class="base-modal__header">
            <slot name="header">
              <span class="base-modal__title">{{ title }}</span>
            </slot>
            <button
              v-if="closable"
              class="base-modal__close"
              aria-label="Закрыть"
              @click="close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="base-modal__body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="base-modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.base-modal {
  // Layout
  @include flex-center;
  position: fixed;
  inset: 0;
  z-index: $z-index-modal;

  // Visual
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);

  &__dialog {
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - #{$spacing-xl} * 2);
    overflow: hidden;

    background: $color-bg-secondary;
    border: 1px solid $color-border;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-xl;

    &--sm { width: min(400px, 90vw); }
    &--md { width: min(560px, 90vw); }
    &--lg { width: min(800px, 90vw); }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $color-border;
    flex-shrink: 0;
  }

  &__title {
    font-family: $font-display;
    font-size: 18px;
    color: $color-text-primary;
    letter-spacing: 0.05em;
  }

  &__close {
    @include flex-center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: $border-radius-sm;
    background: transparent;
    color: $color-text-secondary;
    cursor: pointer;
    transition: background $transition-fast, color $transition-fast;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: $color-text-primary;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__body {
    padding: $spacing-lg;
    overflow-y: auto;
    flex: 1;
    @include custom-scrollbar;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: $spacing-sm;
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $color-border;
    flex-shrink: 0;
  }
}

// Transition
.modal-enter-active,
.modal-leave-active {
  transition: opacity $transition-normal;

  .base-modal__dialog {
    transition: transform $transition-normal, opacity $transition-normal;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .base-modal__dialog {
    transform: scale(0.95) translateY(-8px);
    opacity: 0;
  }
}
</style>

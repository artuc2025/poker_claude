<script setup lang="ts">
// 1. Props & Emits
const props = withDefaults(defineProps<{
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: 'text' | 'number' | 'password' | 'email'
  error?: string
  hint?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}>(), {
  type: 'text',
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

// 2. Composables
const slots = useSlots()

// 3. Reactive state
const isFocused = ref(false)
const inputId = `input-${Math.random().toString(36).slice(2, 9)}`

// 4. Computed
const wrapperClasses = computed(() => [
  'base-input',
  `base-input--${props.size}`,
  {
    'base-input--focused': isFocused.value,
    'base-input--error': !!props.error,
    'base-input--disabled': props.disabled,
    'base-input--has-prefix': !!slots.prefix,
    'base-input--has-suffix': !!slots.suffix,
  },
])

// 5. Methods
function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value: string | number = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

function onFocus(event: FocusEvent) {
  isFocused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  isFocused.value = false
  emit('blur', event)
}
</script>

<template>
  <div :class="wrapperClasses">
    <label v-if="label" :for="inputId" class="base-input__label">
      {{ label }}
    </label>

    <div class="base-input__field">
      <div v-if="$slots.prefix" class="base-input__prefix">
        <slot name="prefix" />
      </div>

      <input
        :id="inputId"
        class="base-input__control"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />

      <div v-if="$slots.suffix" class="base-input__suffix">
        <slot name="suffix" />
      </div>
    </div>

    <span v-if="error" class="base-input__error" role="alert">{{ error }}</span>
    <span v-else-if="hint" class="base-input__hint">{{ hint }}</span>
  </div>
</template>

<style lang="scss" scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__label {
    font-family: $font-body;
    font-size: 12px;
    font-weight: 500;
    color: var(--color-text-secondary);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__field {
    display: flex;
    align-items: center;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-primary);
    border-radius: $border-radius-md;
    transition: border-color $transition-fast, box-shadow $transition-fast;
    overflow: hidden;
  }

  &__prefix,
  &__suffix {
    @include flex-center;
    padding: 0 $spacing-sm;
    color: var(--color-text-secondary);
    flex-shrink: 0;
  }

  &__control {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    outline: none;
    color: var(--color-text-primary);
    font-family: $font-body;

    &::placeholder {
      color: var(--color-text-secondary);
      opacity: 0.6;
    }

    // Remove number input arrows
    &[type='number']::-webkit-inner-spin-button,
    &[type='number']::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }

  &__error {
    font-size: 11px;
    color: $color-accent-red;
  }

  &__hint {
    font-size: 11px;
    color: var(--color-text-secondary);
  }

  // --- Sizes ---
  &--sm {
    .base-input__field { height: 32px; }
    .base-input__control { padding: 0 $spacing-sm; font-size: 12px; }
  }

  &--md {
    .base-input__field { height: 40px; }
    .base-input__control { padding: 0 $spacing-md; font-size: 14px; }
  }

  &--lg {
    .base-input__field { height: 48px; }
    .base-input__control { padding: 0 $spacing-md; font-size: 16px; }
  }

  // --- States ---
  &--focused .base-input__field {
    border-color: $color-accent-gold;
    box-shadow: 0 0 0 2px rgba($color-accent-gold, 0.2);
  }

  &--error .base-input__field {
    border-color: $color-accent-red;
    box-shadow: 0 0 0 2px rgba($color-accent-red, 0.15);
  }

  &--disabled {
    opacity: 0.45;
    pointer-events: none;
  }
}
</style>

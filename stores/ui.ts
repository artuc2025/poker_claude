import { defineStore } from 'pinia'
import type { Toast, ToastType, Theme, ModalId } from '@/types/ui'

interface UiState {
  theme: Theme
  activeModal: ModalId
  modalPayload: Record<string, unknown>
  toasts: Toast[]
  soundEnabled: boolean
  sidebarCollapsed: boolean
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    theme: 'dark',
    activeModal: null,
    modalPayload: {},
    toasts: [],
    soundEnabled: true,
    sidebarCollapsed: false,
  }),

  getters: {
    isModalOpen(state): boolean {
      return state.activeModal !== null
    },

    isDark(state): boolean {
      return state.theme === 'dark'
    },
  },

  actions: {
    openModal(id: ModalId, payload: Record<string, unknown> = {}) {
      this.activeModal = id
      this.modalPayload = payload
    },

    closeModal() {
      this.activeModal = null
      this.modalPayload = {}
    },

    showToast(message: string, type: ToastType = 'info', duration = 4000) {
      const toast: Toast = {
        id: generateId(),
        type,
        message,
        duration,
      }
      this.toasts.push(toast)

      if (duration > 0) {
        setTimeout(() => this.removeToast(toast.id), duration)
      }
    },

    removeToast(id: string) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },

    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
    },

    setTheme(theme: Theme) {
      this.theme = theme
    },

    toggleSound() {
      this.soundEnabled = !this.soundEnabled
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed
    },
  },
})

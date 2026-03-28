export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type Theme = 'dark' | 'light'
export type ModalId = 'settings' | 'deposit' | 'hand-detail' | 'table-info' | 'tournament-info' | 'avatar-picker' | null

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration: number  // ms, 0 = permanent
}

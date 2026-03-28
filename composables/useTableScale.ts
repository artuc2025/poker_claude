// Computes a zoom factor so the poker table fits inside its container.
// Uses ResizeObserver so it reacts to window resize and layout shifts.

const TABLE_W = 900
// table(540) + gap(16) + action panel(~165) + breathing room
const TABLE_H_TOTAL = 740

export function useTableScale(containerEl: Ref<HTMLElement | null>) {
  const scale = ref(1)

  function recalculate() {
    const el = containerEl.value
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    const s = Math.min(1, width / TABLE_W, height / TABLE_H_TOTAL)
    // Round to 3 decimals to avoid sub-pixel thrash
    scale.value = Math.round(s * 1000) / 1000
  }

  let ro: ResizeObserver | null = null

  onMounted(() => {
    ro = new ResizeObserver(recalculate)
    if (containerEl.value) ro.observe(containerEl.value)
    recalculate()
  })

  watch(containerEl, (el) => {
    if (el) {
      ro?.observe(el)
      recalculate()
    }
  })

  onUnmounted(() => ro?.disconnect())

  return { scale }
}

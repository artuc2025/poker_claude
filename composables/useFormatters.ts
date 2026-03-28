export function useFormatters() {
  function formatDate(iso: string): string {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  function formatResult(result: number): string {
    return result >= 0 ? `+$${result}` : `-$${Math.abs(result)}`
  }

  function formatBankroll(val: number): string {
    return val >= 1_000 ? `$${(val / 1_000).toFixed(1)}k` : `$${val}`
  }

  return { formatDate, formatResult, formatBankroll }
}

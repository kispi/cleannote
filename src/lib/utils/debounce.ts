export function createDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): { debounced: (...args: Parameters<T>) => void; cleanup: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null

  const debounced = (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }

  const cleanup = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return { debounced, cleanup }
}

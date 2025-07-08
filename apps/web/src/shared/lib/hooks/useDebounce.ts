import * as React from 'react'

/**
 * Debounce Hook
 * @description Verzögert Wertänderungen um die angegebene Zeit
 * @param value - Zu debouncender Wert
 * @param delay - Verzögerung in Millisekunden
 * @returns Debounceter Wert
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

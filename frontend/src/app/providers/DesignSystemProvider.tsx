import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface DesignSystemProviderProps {
  children: ReactNode
}

export function DesignSystemProvider({ children }: DesignSystemProviderProps) {
  useEffect(() => {
    // Apply CSS Custom Properties
    const root = document.documentElement

    // Colors
    root.style.setProperty('--color-fanini-blue', faniniTheme.colors.fanini.blue.DEFAULT)
    root.style.setProperty('--color-fanini-red', faniniTheme.colors.fanini.red.DEFAULT)

    // Typography
    root.style.setProperty('--font-sans', faniniTheme.typography.fontFamily.sans.join(', '))
    root.style.setProperty('--font-heading', faniniTheme.typography.fontFamily.heading.join(', '))
  }, [])

  return <>{children}</>
}

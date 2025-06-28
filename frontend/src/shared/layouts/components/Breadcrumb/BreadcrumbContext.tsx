import { createContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

export interface BreadcrumbSegment {
  label: string
  path?: string
  isLoading?: boolean
}

export interface BreadcrumbContextValue {
  segments: BreadcrumbSegment[]
  setSegments: (segments: BreadcrumbSegment[]) => void
  addSegment: (segment: BreadcrumbSegment) => void
  removeSegment: (path: string) => void
  updateSegment: (path: string, updates: Partial<BreadcrumbSegment>) => void
}

export const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null)

interface BreadcrumbProviderProps {
  children: ReactNode
}

export function BreadcrumbProvider({ children }: BreadcrumbProviderProps) {
  const [segments, setSegments] = useState<BreadcrumbSegment[]>([])

  const addSegment = useCallback((segment: BreadcrumbSegment) => {
    setSegments(prev => [...prev, segment])
  }, [])

  const removeSegment = useCallback((path: string) => {
    setSegments(prev => prev.filter(s => s.path !== path))
  }, [])

  const updateSegment = useCallback((path: string, updates: Partial<BreadcrumbSegment>) => {
    setSegments(prev => prev.map(s => (s.path === path ? { ...s, ...updates } : s)))
  }, [])

  return (
    <BreadcrumbContext.Provider
      value={{
        segments,
        setSegments,
        addSegment,
        removeSegment,
        updateSegment,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  )
}

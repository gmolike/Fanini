import { useContext, useEffect } from 'react'
import { useLocation, useMatches } from '@tanstack/react-router'
import { BreadcrumbContext } from './BreadcrumbContext'

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext)
  const location = useLocation()
  const matches = useMatches()

  if (!context) {
    throw new Error('useBreadcrumb must be used within BreadcrumbProvider')
  }

  useEffect(() => {
    // Auto-generate breadcrumbs from route matches
    const segments = matches
      .filter(match => match.context?.breadcrumb)
      .map(match => ({
        label: match.context.breadcrumb.label,
        path: match.pathname,
      }))

    context.setSegments(segments)
  }, [location, matches, context])

  return context
}

export function useBreadcrumbSegment(segment: { label: string; path?: string }) {
  const context = useContext(BreadcrumbContext)

  useEffect(() => {
    if (context) {
      context.addSegment(segment)
      return () => {
        if (segment.path) {
          context.removeSegment(segment.path)
        }
      }
    }
  }, [context, segment])
}

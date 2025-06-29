// frontend/src/shared/ui/breadcrumb/model/context.ts
import { createContext } from 'react'

import type { BreadcrumbContextValue } from './types'

export const BreadcrumbContext = createContext<BreadcrumbContextValue>({
  items: [],
  setItems: () => {},
  resetToAuto: () => {},
})

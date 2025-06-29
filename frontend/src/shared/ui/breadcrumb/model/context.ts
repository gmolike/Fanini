// frontend/src/shared/ui/breadcrumb/model/context.ts
import { createContext } from 'react';

import type { BreadcrumbContextValue } from './types';

export const BreadcrumbContext = createContext<BreadcrumbContextValue>({
  items: [],
  setItems: _items => {
    // Default implementation: does nothing
  },
  resetToAuto: () => {
    // Default implementation: does nothing
  },
});

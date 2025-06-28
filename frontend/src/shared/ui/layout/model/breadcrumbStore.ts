import { create } from 'zustand'
import type { BreadcrumbItem } from './types'

type BreadcrumbStore = {
  items: BreadcrumbItem[]
  setItems: (items: BreadcrumbItem[]) => void
  addItem: (item: BreadcrumbItem) => void
  removeItem: (label: string) => void
  clear: () => void
}

/**
 * Zustand Store für Breadcrumb State
 * @description Verwaltet die Breadcrumb-Navigation global
 */
export const useBreadcrumbStore = create<BreadcrumbStore>(set => ({
  items: [],
  setItems: items => set({ items }),
  addItem: item => set(state => ({ items: [...state.items, item] })),
  removeItem: label =>
    set(state => ({
      items: state.items.filter(item => item.label !== label),
    })),
  clear: () => set({ items: [] }),
}))

import { cn } from '@/shared/lib'

import type { DataGridProps } from '../model/types'

/**
 * DataGrid Komponente
 * @description Responsives Grid für DataField Komponenten
 */
export const DataGrid = ({ children, columns = 2, bordered = true, className }: DataGridProps) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div
      className={cn(
        'grid gap-4',
        gridCols[columns],
        bordered && 'rounded-lg border p-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

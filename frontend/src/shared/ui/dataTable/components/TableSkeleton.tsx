import { v4 as uuidv4 } from 'uuid';

import { Skeleton } from '@/shared/shadcn';

import type { TableSkeletonProps } from '../types';

/**
 * Skeleton Loading State für DataTable
 *
 * @component
 * @param props - Skeleton Konfiguration
 *
 * @example
 * ```tsx
 * <TableSkeleton
 *   columns={columns}
 *   rows={10}
 *   showToolbar
 * />
 * ```
 */
export const TableSkeleton = <TData = unknown, TValue = unknown>({
  columns,
  rows = 10,
  showToolbar = true,
  showPagination = true,
}: TableSkeletonProps<TData, TValue>) => (
  <div className="space-y-4">
    {showToolbar ? (
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px] lg:w-[300px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    ) : null}

    <div className="rounded-md border">
      <div className="p-0">
        {/* Header */}
        <div className="bg-muted/50 border-b p-3">
          <div className="flex gap-4">
            {columns.slice(0, 5).map(column => (
              <Skeleton key={column.id} className="h-4 w-24" />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="space-y-3 p-3">
          {Array.from({ length: rows }).map(() => (
            <div key={uuidv4()} className="flex gap-4">
              {columns.slice(0, 5).map(() => {
                // eslint-disable-next-line sonarjs/pseudo-random
                const randomWidth = (Math.random() * 60 + 40).toFixed(0); // Ensures string type
                return (
                  <Skeleton
                    key={uuidv4()}
                    className="h-4 w-24"
                    style={{ width: `${randomWidth}px` }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>

    {showPagination ? (
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
        </div>
      </div>
    ) : null}
  </div>
);

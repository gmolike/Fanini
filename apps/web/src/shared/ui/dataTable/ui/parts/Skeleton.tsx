/**
 * @module dataTable/parts/Skeleton
 * @description Skeleton Loading State für Tabellen
 */

import { v4 as uuidv4 } from 'uuid';

import { Skeleton as SkeletonPrimitive } from '@/shared/shadcn';

import type { SkeletonProps } from '../../model/types';

/**
 * Skeleton Component
 *
 * @description Zeigt einen Lade-Skeleton während Daten geladen werden
 *
 * @param props - Skeleton Properties
 * @returns Rendered skeleton state
 */
export const Skeleton = <TData = unknown, TValue = unknown>({
  columns,
  rows = 10,
  showToolbar = true,
  showPagination = true,
}: SkeletonProps<TData, TValue>) => (
  <div className="space-y-4">
    {showToolbar ? <div className="flex items-center justify-between">
        <SkeletonPrimitive className="h-8 w-[200px] lg:w-[300px]" />
        <div className="flex items-center gap-2">
          <SkeletonPrimitive className="h-8 w-24" />
          <SkeletonPrimitive className="h-8 w-24" />
        </div>
      </div> : null}

    <div className="rounded-md border">
      <div className="p-0">
        <div className="bg-muted/50 border-b p-3">
          <div className="flex gap-4">
            {columns.slice(0, 5).map(column => (
              <SkeletonPrimitive key={column.id} className="h-4 w-24" />
            ))}
          </div>
        </div>

        <div className="space-y-3 p-3">
          {Array.from({ length: rows }).map(() => (
            <div key={uuidv4()} className="flex gap-4">
              {columns.slice(0, 5).map(() => (
                <SkeletonPrimitive
                  key={uuidv4()}
                  className="h-4"
                  // eslint-disable-next-line sonarjs/pseudo-random
                  style={{ width: `${(Math.random() * 60 + 40).toFixed(0)}px` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>

    {showPagination ? <div className="flex items-center justify-between">
        <SkeletonPrimitive className="h-8 w-32" />
        <div className="flex gap-2">
          <SkeletonPrimitive className="size-8" />
          <SkeletonPrimitive className="size-8" />
          <SkeletonPrimitive className="size-8" />
          <SkeletonPrimitive className="size-8" />
        </div>
      </div> : null}
  </div>
);

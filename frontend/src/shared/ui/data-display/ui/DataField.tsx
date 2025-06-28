import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn/ui/tooltip'
import type { DataFieldProps } from '../model/types'

/**
 * DataField Komponente
 * @description Zeigt ein Label-Value Paar mit optionalem Icon
 */
export const DataField = ({
  label,
  value,
  icon,
  className,
  valueClassName,
  highlightEmpty = false,
}: DataFieldProps) => {
  const isEmpty = !value || value === '–'
  const displayValue = value || '–'

  const content = (
    <div className={cn('flex items-start gap-3', className)}>
      {icon && <div className="text-muted-foreground mt-0.5 flex-shrink-0">{icon}</div>}
      <div className="min-w-0 flex-1">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div
          className={cn(
            'font-medium',
            isEmpty && highlightEmpty && 'text-destructive',
            valueClassName,
          )}
        >
          {displayValue}
        </div>
      </div>
    </div>
  )

  // Tooltip nur bei Overflow
  if (typeof displayValue === 'string' && displayValue.length > 50) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="truncate">{content}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{displayValue}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

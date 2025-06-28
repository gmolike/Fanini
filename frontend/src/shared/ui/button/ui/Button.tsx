import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Button as ShadcnButton } from '@/shared/shadcn/button'
import { cn } from '@/shared/lib'
import type { ButtonProps } from '../model/types'

/**
 * Button Komponente mit Loading State
 * @description Erweitert shadcn/ui Button um Loading-Funktionalität
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, loading, disabled, ...props }, ref) => {
    return (
      <ShadcnButton ref={ref} disabled={disabled || loading} className={cn(className)} {...props}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </ShadcnButton>
    )
  },
)

Button.displayName = 'Button'

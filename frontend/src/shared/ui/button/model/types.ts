import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from '@/shared/shadcn/ui/button'

/**
 * Button Komponenten Types
 */
export type ButtonVariant = VariantProps<typeof buttonVariants>['variant']
export type ButtonSize = VariantProps<typeof buttonVariants>['size']

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }

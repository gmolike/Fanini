import type { buttonVariants } from '@/shared/shadcn/button'

import type { VariantProps } from 'class-variance-authority'












export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }

export type ButtonSize = VariantProps<typeof buttonVariants>['size']

/**
 * Button Komponenten Types
 */
export type ButtonVariant = VariantProps<typeof buttonVariants>['variant']

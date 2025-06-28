import { faniniTheme } from '@/shared/design-system/themes'

type TokenPath = string // e.g., 'colors.fanini.blue' or 'spacing.4'

export function getToken(path: TokenPath): string {
  const keys = path.split('.')
  let value: any = faniniTheme

  for (const key of keys) {
    value = value?.[key]
    if (value === undefined) {
      console.warn(`Token not found: ${path}`)
      return ''
    }
  }

  return value
}

export function composeStyles(
  config: Record<string, any>,
  variant: string,
  state?: string,
): string {
  const variantStyles = config.variants?.[variant] || ''
  const stateStyles = state ? config.states?.[state] : ''

  return [variantStyles, stateStyles].filter(Boolean).join(' ')
}

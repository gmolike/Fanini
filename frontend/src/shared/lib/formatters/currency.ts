export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'de-DE',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(
  value: number,
  locale: string = 'de-DE',
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value)
}

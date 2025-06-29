/**
 * Formatiert ein Datum nach deutschem Standard
 * @param date - Datum als Date oder ISO String
 * @param includeTime - Zeit anzeigen
 * @returns Formatiertes Datum
 */
export const formatDate = (date: Date | string, includeTime = false): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
  return dateObj.toLocaleDateString('de-DE', options)
}

/**
 * Formatiert einen Betrag als Währung
 * @param amount - Betrag
 * @returns Formatierter Währungsbetrag
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'

export function formatDate(date: Date | string, formatStr: string = 'dd.MM.yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: de })
}

export function formatDateTime(date: Date | string, showTime: boolean = true): string {
  const formatStr = showTime ? 'dd.MM.yyyy HH:mm' : 'dd.MM.yyyy'
  return formatDate(date, formatStr)
}

export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Heute'
  if (diffInDays === 1) return 'Gestern'
  if (diffInDays < 7) return `vor ${diffInDays} Tagen`

  return formatDate(dateObj)
}

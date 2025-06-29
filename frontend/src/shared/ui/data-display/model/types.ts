/**
 * DataDisplay Komponenten Types
 */
export interface DataFieldProps {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
  className?: string
  valueClassName?: string
  /** Zeigt fehlende Werte visuell hervor */
  highlightEmpty?: boolean
}

export interface DataGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
  /** Fügt Padding und Border hinzu */
  bordered?: boolean
}

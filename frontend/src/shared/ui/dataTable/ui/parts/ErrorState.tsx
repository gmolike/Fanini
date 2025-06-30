/**
 * @module dataTable/parts/ErrorState
 * @description Error State für Fehlerbehandlung
 */

import { AlertCircle } from 'lucide-react';

import { Button } from '@/shared/shadcn';

import type { ErrorStateProps } from '../../model/types';

/**
 * Error State Component
 *
 * @description Zeigt Fehlermeldungen mit optionaler Retry-Funktion
 *
 * @param props - Error State Properties
 * @returns Rendered error state
 */
export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <AlertCircle className="text-destructive mb-4 h-12 w-12" />
    <h3 className="mb-2 text-lg font-semibold">Fehler beim Laden</h3>
    <p className="text-muted-foreground mb-4 text-sm">
      {error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
    </p>
    {onRetry ? (
      <Button onClick={onRetry} variant="outline" size="sm">
        Erneut versuchen
      </Button>
    ) : null}
  </div>
);

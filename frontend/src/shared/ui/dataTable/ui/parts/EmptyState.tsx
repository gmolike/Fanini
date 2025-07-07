/**
 * @module dataTable/parts/EmptyState
 * @description Empty State für leere Tabellen
 */

import { FileX2 } from 'lucide-react';

/**
 * Empty State Component
 *
 * @description Zeigt eine benutzerfreundliche Nachricht wenn keine Daten vorhanden sind
 *
 * @returns Rendered empty state
 */
export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <FileX2 className="text-muted-foreground mb-4 h-12 w-12" />
    <h3 className="mb-2 text-lg font-semibold">Keine Daten vorhanden</h3>
    <p className="text-muted-foreground text-sm">Es wurden keine Einträge gefunden.</p>
  </div>
);

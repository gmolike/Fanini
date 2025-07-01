// frontend/src/features/public/event-detail/ui/History.tsx
import { History as HistoryIcon } from 'lucide-react';

import type { PublicEventDetail } from '@/entities/public/event';

type HistoryProps = {
  history: NonNullable<PublicEventDetail['history']>;
};

/**
 * History Component
 * @description Zeigt die Event-Historie
 */
export const History = ({ history }: HistoryProps) => {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-semibold">
        <HistoryIcon className="h-4 w-4" />
        Historie
      </h3>
      <div className="space-y-2">
        {history.map(entry => (
          <div key={entry.date} className="flex items-start gap-3 text-sm">
            <div className="bg-muted-foreground mt-1.5 h-2 w-2 rounded-full" />
            <div>
              <p className="font-medium">{entry.description}</p>
              <p className="text-muted-foreground text-xs">
                {new Date(entry.date).toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

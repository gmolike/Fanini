// frontend/src/features/public/event-detail/ui/Registration.tsx
import { ExternalLink, Info } from 'lucide-react';

import type { PublicEventDetail } from '@/entities/public/event';

import { Alert, AlertDescription, Button } from '@/shared/shadcn';

type RegistrationProps = {
  event: PublicEventDetail;
};

/**
 * Registration Component
 * @description Zeigt Registrierungs- und Ticket-Informationen
 */
export const Registration = ({ event }: RegistrationProps) => {
  return (
    <div className="space-y-3">
      {event.registrationRequired ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Anmeldung erforderlich
            {event.registrationDeadline ? (
              <span> bis {new Date(event.registrationDeadline).toLocaleDateString('de-DE')}</span>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}

      {event.ticketLink ? (
        <Button className="w-full" asChild>
          <a href={event.ticketLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Tickets kaufen
          </a>
        </Button>
      ) : null}

      {event.price ? (
        <div className="mt-3">
          <h4 className="mb-1 font-semibold">Preis</h4>
          <p className="text-lg font-bold">
            {event.price.amount.toFixed(2)} {event.price.currency}
          </p>
          {event.price.description ? (
            <p className="text-muted-foreground text-sm">{event.price.description}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

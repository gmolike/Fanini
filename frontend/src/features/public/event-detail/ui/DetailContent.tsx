// frontend/src/features/public/event-detail/ui/EventDetailContent.tsx
import { Separator } from '@/shared/shadcn';

import { EventHeader } from './EventHeader';
import { EventInfo } from './EventInfo';
import { EventDescription } from './EventDescription';
import { EventRegistration } from './EventRegistration';
import { EventHistory } from './EventHistory';
import { EventComments } from './Comments';

import type { PublicEventDetail } from '@/entities/public/event';

type EventDetailContentProps = {
  event: PublicEventDetail;
};

/**
 * EventDetailContent Component
 * @description Strukturiert die Event-Detail Anzeige
 */
export const EventDetailContent = ({ event }: EventDetailContentProps) => {
  return (
    <div className="space-y-6 p-6">
      <EventHeader event={event} />

      <Separator />

      <EventInfo event={event} />

      <Separator />

      <EventDescription description={event.description} />

      {(event.registrationRequired || event.ticketLink) && (
        <>
          <Separator />
          <EventRegistration event={event} />
        </>
      )}

      {event.history && event.history.length > 0 && (
        <>
          <Separator />
          <EventHistory history={event.history} />
        </>
      )}

      {event.status === 'completed' && event.comments && (
        <>
          <Separator />
          <EventComments comments={event.comments} />
        </>
      )}
    </div>
  );
};

// frontend/src/features/public/event-detail/ui/DetailContent.tsx
import type { PublicEventDetail } from '@/entities/public/event';

import { Separator } from '@/shared/shadcn';

import { Comments } from './Comments';
import { Description } from './Description';
import { Header } from './Header';
import { History } from './History';
import { Info } from './Info';
import { Registration } from './Registration';

type DetailContentProps = {
  event: PublicEventDetail;
};

/**
 * DetailContent Component
 * @description Strukturiert die Event-Detail Anzeige
 */
export const DetailContent = ({ event }: DetailContentProps) => {
  return (
    <div className="space-y-6 p-6">
      <Header event={event} />

      <Separator />

      <Info event={event} />

      <Separator />

      <Description description={event.description} />

      {event.registrationRequired || event.ticketLink ? (
        <>
          <Separator />
          <Registration event={event} />
        </>
      ) : null}

      {event.history && event.history.length > 0 ? (
        <>
          <Separator />
          <History history={event.history} />
        </>
      ) : null}

      {event.status === 'completed' && event.comments ? (
        <>
          <Separator />
          <Comments comments={event.comments} />
        </>
      ) : null}
    </div>
  );
};

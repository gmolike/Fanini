// frontend/src/features/public/event-detail/ui/EventDetailPanel.tsx
import { usePublicEventDetail } from '@/entities/public/event';
import { LoadingState } from '@/shared/ui';

import { EventDetailContent } from './EventDetailContent';

type EventDetailPanelProps = {
  eventId: string;
};

/**
 * EventDetailPanel Feature
 * @description Lädt und zeigt Event-Details
 */
export const EventDetailPanel = ({ eventId }: EventDetailPanelProps) => {
  const eventDetailQuery = usePublicEventDetail(eventId);

  return (
    <LoadingState query={eventDetailQuery}>
      {response => <EventDetailContent event={response.data} />}
    </LoadingState>
  );
};

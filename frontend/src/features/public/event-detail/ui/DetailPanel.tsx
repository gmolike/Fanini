// frontend/src/features/public/event-detail/ui/DetailPanel.tsx
import { type PublicEventDetailResponse, usePublicEventDetail } from '@/entities/public/event';

import { LoadingState } from '@/shared/ui';

import { DetailContent } from './DetailContent';

type DetailPanelProps = {
  eventId: string;
};

/**
 * DetailPanel Feature
 * @description Lädt und zeigt Event-Details
 */
export const DetailPanel = ({ eventId }: DetailPanelProps) => {
  const eventDetailQuery = usePublicEventDetail(eventId);

  return (
    <LoadingState<PublicEventDetailResponse> query={eventDetailQuery()}>
      {response => <DetailContent event={response.data} />}
    </LoadingState>
  );
};

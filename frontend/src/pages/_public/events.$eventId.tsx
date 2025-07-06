// pages/_public/events.$eventId.tsx
import { createFileRoute, useParams } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

import { EventDetailView } from '@/features/public/event-detail';

import { usePublicEventDetail } from '@/entities/public/event';

import { GlassCard, LoadingState } from '@/shared/ui';

export const Route = createFileRoute('/_public/events/$eventId')({
  component: EventDetail,
});

function EventDetail() {
  const params = useParams({ strict: false });
  const { eventId } = params;

  if (typeof eventId !== 'string' || eventId.trim() === '') {
    throw new Error('Event ID is required');
  }

  // Jetzt verwenden wir die korrekte Struktur analog zu useGremiumDetail
  const eventQuery = usePublicEventDetail({ eventId });

  return (
    <LoadingState
      query={eventQuery}
      loadingFallback={
        <div className="flex min-h-screen items-center justify-center">
          <GlassCard className="p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-fanini-blue)]" />
          </GlassCard>
        </div>
      }
    >
      {response => <EventDetailView event={response.data} />}
    </LoadingState>
  );
}

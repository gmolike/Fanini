// pages/_public/about.$gremiumId.tsx
import { createFileRoute, useParams } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

import { OrganizationDetailView } from '@/features/public/organization-detail';

import { useGremiumDetail } from '@/entities/public/organization';

import { GlassCard, LoadingState } from '@/shared/ui';

export const Route = createFileRoute('/_public/about/$gremiumId')({
  component: GremiumDetail,
});

function GremiumDetail() {
  const params = useParams({ strict: false });
  const { gremiumId } = params;

  if (!gremiumId) {
    throw new Error('Gremium ID is required');
  }

  // Verwende den Hook mit einem Parameter-Objekt
  const gremiumQuery = useGremiumDetail({ gremiumId });

  return (
    <LoadingState
      query={gremiumQuery}
      loadingFallback={
        <div className="flex min-h-screen items-center justify-center">
          <GlassCard className="p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-fanini-blue)]" />
          </GlassCard>
        </div>
      }
    >
      {response => {
        return <OrganizationDetailView gremium={response.data} />;
      }}
    </LoadingState>
  );
}

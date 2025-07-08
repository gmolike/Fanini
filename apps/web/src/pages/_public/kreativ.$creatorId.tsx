// pages/_public/kreativ.$creatorId.tsx
import { createFileRoute, useParams } from '@tanstack/react-router';

import { CreatorDetailView } from '@/features/public/creator-detail';

import { useCreatorDetail } from '@/entities/public/creator';

import { LoadingState } from '@/shared/ui';

export const Route = createFileRoute('/_public/kreativ/$creatorId')({
  component: CreatorDetail,
});

function CreatorDetail() {
  const params = useParams({ strict: false });
  const { creatorId } = params;

  if (typeof creatorId !== 'string' || creatorId.trim() === '') {
    throw new Error('Creator ID is required');
  }

  const creatorQuery = useCreatorDetail({ creatorId });

  return (
    <LoadingState query={creatorQuery}>
      {response => <CreatorDetailView creator={response.data} />}
    </LoadingState>
  );
}

// apps/web/src/pages/intern/member/index.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/intern/member/')({
  beforeLoad: () => {
    // Redirect zur Liste
    throw new Error(
      JSON.stringify(
        redirect({
          to: '/intern/member/list',
        })
      )
    );
  },
});

// frontend/src/pages/$.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$')({
  component: () => (
    <div>
      404 - Seite nicht gefunden. <a href="/app">Zum App-Bereich</a>
    </div>
  ),
})

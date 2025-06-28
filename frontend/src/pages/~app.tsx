// src/pages/~app.tsx
import { AppLayout } from '@/widgets/Layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

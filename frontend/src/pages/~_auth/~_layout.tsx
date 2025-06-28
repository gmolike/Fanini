import { AuthLayout } from '@/widgets/Layout/Auth/Auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout')({
  component: AuthLayout,
})

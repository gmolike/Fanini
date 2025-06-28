// frontend/src/pages/~app/~index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {/* Dashboard Content */}
    </div>
  )
}

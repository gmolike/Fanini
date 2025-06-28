import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/shared/shadcn/button'
import { Plus } from 'lucide-react'
import { usePageLayout } from '@/shared/hooks/usePageLayout'

export const Route = createFileRoute('/app/dashboard')({
  component: DashboardPage,
  staticData: {
    layout: {
      breadcrumb: { label: 'Dashboard' },
    },
  },
})

function DashboardPage() {
  usePageLayout({
    type: 'app',
    showSidebar: true,
    pageHeader: {
      title: 'Dashboard',
      description: 'Willkommen im Mitgliederbereich',
      actions: (
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Neues Event
        </Button>
      ),
    },
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="font-semibold text-lg mb-2">Kommende Events</h3>
          <p className="text-3xl font-bold text-primary">3</p>
          <p className="text-sm text-muted-foreground">In den nächsten 30 Tagen</p>
        </div>
      </div>
    </div>
  )
}

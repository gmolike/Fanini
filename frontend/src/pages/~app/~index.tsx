import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="font-semibold mb-2">Nächstes Event</h3>
          <p className="text-muted-foreground">Kommt bald...</p>
        </div>
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="font-semibold mb-2">Offene Todos</h3>
          <p className="text-muted-foreground">0 Aufgaben</p>
        </div>
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="font-semibold mb-2">Mitglieder</h3>
          <p className="text-muted-foreground">-- Aktiv</p>
        </div>
      </div>
    </div>
  )
}

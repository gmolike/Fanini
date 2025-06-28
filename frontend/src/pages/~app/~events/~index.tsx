import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/events/')({
  component: EventsListPage,
})

function EventsListPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Events</h1>
      <div className="bg-card rounded-lg p-6 border">
        <p className="text-muted-foreground">Event-Liste kommt hier hin</p>
      </div>
    </div>
  )
}

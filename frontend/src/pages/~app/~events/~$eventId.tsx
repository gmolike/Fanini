import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/events/$eventId')({
  component: EventDetailPage,
})

function EventDetailPage() {
  const { eventId } = Route.useParams()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Event Details</h1>
      <p className="text-muted-foreground">Event ID: {eventId}</p>
    </div>
  )
}

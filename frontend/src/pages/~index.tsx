import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-fanini-blue mb-8">
        Faninitiative Spandau e.V.
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-2xl font-semibold mb-4">Willkommen</h2>
          <p className="text-muted-foreground mb-4">
            Die offizielle Plattform des Fanvereins der Eintracht Spandau.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center text-fanini-red hover:underline"
          >
            Zum Mitgliederbereich â†’
          </Link>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-2xl font-semibold mb-4">Events</h2>
          <p className="text-muted-foreground mb-4">
            Aktuelle Veranstaltungen und Treffen des Vereins.
          </p>
          <Link
            to="/app/events"
            className="inline-flex items-center text-fanini-red hover:underline"
          >
            Alle Events ansehen â†’
          </Link>
        </div>
      </div>
    </div>
  )
}

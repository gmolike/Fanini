// frontend/src/pages/~index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { PublicLayout } from '@/widgets/Layout'
import { Container } from '@/shared/ui/layout/Container'
import { Button } from '@/shared/shadcn/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <PublicLayout>
      <Container className="py-12">
        <h1 className="text-4xl font-bold mb-6">Faninitiative Spandau e.V.</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Willkommen beim offiziellen Fanverein der Eintracht Spandau
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold text-lg mb-2">Nächstes Event</h3>
            <p className="text-muted-foreground">
              Hier entsteht eine Übersicht der kommenden Vereinsevents.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold text-lg mb-2">Aktuelle News</h3>
            <p className="text-muted-foreground">
              Hier entstehen die neuesten Nachrichten und Rückblicke.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold text-lg mb-2">Unsere Künstler</h3>
            <p className="text-muted-foreground">
              Hier entsteht eine Übersicht unserer talentierten Vereinskünstler.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Button asChild size="lg">
            <a href="/app">Zum Mitgliederbereich</a>
          </Button>
        </div>
      </Container>
    </PublicLayout>
  )
}

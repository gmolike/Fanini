import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/shared/shadcn/button'
import { Container } from '@/shared/ui/layout/Container'
import { PageHeader } from '@/shared/ui/layout/PageHeader'

export const Route = createFileRoute('/_public/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <PageHeader
        title="Faninitiative Spandau e.V."
        description="Willkommen beim offiziellen Fanverein der Eintracht Spandau"
        variant="hero"
        actions={
          <Button asChild size="lg">
            <a href="/mitglied-werden">Jetzt Mitglied werden</a>
          </Button>
        }
      />

      <Container className="py-12">
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
      </Container>
    </>
  )
}

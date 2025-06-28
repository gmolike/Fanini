import { createFileRoute } from '@tanstack/react-router'
import { Container } from '@/shared/ui/layout/Container'
import { usePageLayout } from '@/shared/hooks/usePageLayout'

export const Route = createFileRoute('/verein/')({
  component: VereinPage,
  staticData: {
    layout: {
      breadcrumb: { label: 'Verein' },
    },
  },
})

function VereinPage() {
  usePageLayout({
    type: 'public',
    pageHeader: {
      title: 'Über unseren Verein',
      description: 'Erfahren Sie mehr über die Faninitiative Spandau e.V. und unsere Mission',
    },
  })

  return (
    <Container className="py-12">
      <div className="prose max-w-none">
        <h2>Hier entsteht die Vereinsübersicht</h2>
        <p>
          Die Faninitiative Spandau e.V. ist der offizielle Fanverein der Eintracht Spandau. Hier
          werden bald alle wichtigen Informationen über unseren Verein, unsere Geschichte und unsere
          Ziele zu finden sein.
        </p>
      </div>
    </Container>
  )
}

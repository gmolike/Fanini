import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/imprint')({
  component: ImprintPage,
})

function ImprintPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Impressum</h1>
      <p className="text-muted-foreground">
        Impressum der Faninitiative Spandau e.V.
      </p>
    </div>
  )
}

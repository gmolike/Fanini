import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Ãœber uns</h1>
      <p className="text-muted-foreground">
        Informationen Ã¼ber die Faninitiative Spandau e.V.
      </p>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Datenschutz</h1>
      <p className="text-muted-foreground">
        DatenschutzerklÃ¤rung der Faninitiative Spandau e.V.
      </p>
    </div>
  )
}

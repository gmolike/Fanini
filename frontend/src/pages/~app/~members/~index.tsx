import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/members/')({
  component: MembersListPage,
})

function MembersListPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mitglieder</h1>
      <div className="bg-card rounded-lg p-6 border">
        <p className="text-muted-foreground">Mitgliederliste kommt hier hin</p>
      </div>
    </div>
  )
}

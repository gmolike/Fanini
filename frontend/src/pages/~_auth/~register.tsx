import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Registrieren</h1>
        {/* Register Form wird spÃ¤ter implementiert */}
        <p className="text-center text-muted-foreground">Register Form kommt hier hin</p>
      </div>
    </div>
  )
}

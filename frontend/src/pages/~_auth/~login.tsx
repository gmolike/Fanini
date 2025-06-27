import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Anmelden</h1>
        {/* Login Form wird spÃ¤ter implementiert */}
        <p className="text-center text-muted-foreground">Login Form kommt hier hin</p>
      </div>
    </div>
  )
}

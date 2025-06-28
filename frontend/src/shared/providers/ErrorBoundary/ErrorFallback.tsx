import { Button } from '@/shared/ui/components'

interface ErrorFallbackProps {
  error: Error
  reset: () => void
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-4xl font-heading font-bold text-fanini-red">Oops!</h1>
        <p className="mb-6 text-lg text-muted-foreground">Es ist ein Fehler aufgetreten.</p>
        <details className="mb-6 text-left">
          <summary className="cursor-pointer text-sm text-muted-foreground">
            Technische Details
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">{error.message}</pre>
        </details>
        <Button onClick={reset}>Seite neu laden</Button>
      </div>
    </div>
  )
}

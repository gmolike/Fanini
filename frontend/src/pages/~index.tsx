import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="min-h-dvh p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold" style={{ color: 'var(--color-fanini-blue)' }}>
            Faninitiative Spandau e.V.
          </h1>
          <p className="text-xl" style={{ color: 'var(--color-muted-foreground)' }}>
            Die offizielle Webseite des Fanvereins
          </p>
        </header>

        {/* Farben Test */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Vereinsfarben</h2>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-6 rounded-lg text-white text-center"
              style={{ backgroundColor: 'var(--color-fanini-blue)' }}
            >
              <div className="font-bold">Fanini Blau</div>
              <div className="text-sm opacity-80">#34687e</div>
            </div>
            <div
              className="p-6 rounded-lg text-white text-center"
              style={{ backgroundColor: 'var(--color-fanini-red)' }}
            >
              <div className="font-bold">Fanini Rot</div>
              <div className="text-sm opacity-80">#b94f46</div>
            </div>
          </div>
        </section>

        {/* Buttons Test */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              className="px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
              }}
            >
              Primary Button
            </button>
            <button
              className="px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-secondary-foreground)',
              }}
            >
              Secondary Button
            </button>
            <button
              className="px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-success)',
                color: 'var(--color-success-foreground)',
              }}
            >
              Success Button
            </button>
            <button
              className="px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-destructive)',
                color: 'var(--color-destructive-foreground)',
              }}
            >
              Destructive Button
            </button>
          </div>
        </section>

        {/* Cards Test */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Cards</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: 'var(--color-card)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-card-foreground)',
              }}
            >
              <h3 className="font-bold text-lg mb-2">Standard Card</h3>
              <p style={{ color: 'var(--color-muted-foreground)' }}>
                Dies ist eine normale Karte mit den Standard-Farben.
              </p>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-accent-foreground)',
              }}
            >
              <h3 className="font-bold text-lg mb-2">Accent Card</h3>
              <p>Eine Karte mit Accent-Hintergrund für besondere Inhalte.</p>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{
                backgroundColor: 'var(--color-muted)',
                color: 'var(--color-foreground)',
              }}
            >
              <h3 className="font-bold text-lg mb-2">Muted Card</h3>
              <p style={{ color: 'var(--color-muted-foreground)' }}>
                Eine gedämpfte Karte für weniger wichtige Inhalte.
              </p>
            </div>
          </div>
        </section>

        {/* Dark Mode Toggle (für später) */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Dark Mode Test</h2>
          <button
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="px-4 py-2 rounded border"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-foreground)',
            }}
          >
            Toggle Dark Mode
          </button>
        </section>
      </div>
    </main>
  )
}

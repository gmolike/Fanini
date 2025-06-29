# FSD-Struktur (Feature-Sliced Design)

## Übersicht

Feature-Sliced Design (FSD) ist eine Architektur-Methodik für Frontend-Projekte, die auf klarer Trennung von Verantwortlichkeiten und Skalierbarkeit basiert.

## Layer-Struktur

```
frontend/src/
├── app/                  # App-weite Einstellungen
│   ├── providers/       # React Provider (Auth, Theme, etc.)
│   ├── router/          # Routing-Konfiguration
│   ├── styles/          # Globale Styles
│   └── index.ts
│
├── pages/               # Seiten-Komponenten
│   ├── home/
│   ├── events/
│   ├── members/
│   └── index.ts
│
├── widgets/             # Zusammengesetzte UI-Blöcke
│   ├── header/
│   ├── dashboard/
│   ├── event-calendar/
│   └── index.ts
│
├── features/            # User-Features
│   ├── auth/
│   ├── event-management/
│   ├── member-profile/
│   └── index.ts
│
├── entities/            # Business-Entitäten
│   ├── event/
│   ├── member/
│   ├── task/
│   └── index.ts
│
└── shared/              # Geteilte Ressourcen
    ├── api/
    ├── ui/
    ├── lib/
    └── index.ts
```

## Custom FSD-Anpassungen

### 1. TSX als Haupt-Datei

Statt der Standard-FSD-Struktur mit `ui/` Unterordner:

```
# Standard FSD ❌
features/auth/
├── ui/
│   └── LoginForm.tsx
├── model/
└── index.ts

# Unsere Anpassung ✅
features/auth/
├── LoginForm.tsx        # TSX direkt im Feature-Ordner
├── model/
└── index.ts
```

### 2. Export-Pattern

Jeder Layer-Ordner hat eine `index.ts` für saubere Exports:

```typescript
// features/auth/index.ts
export { LoginForm } from "./LoginForm";
export { useAuth } from "./model/useAuth";
export type { AuthState } from "./model/types";
```

## Layer-Details

### App Layer

```
app/
├── providers/
│   ├── AuthProvider.tsx
│   ├── ThemeProvider.tsx
│   ├── QueryProvider.tsx
│   └── index.tsx         # Kombiniert alle Provider
├── router/
│   ├── router.ts         # TanStack Router Config
│   └── routes.tsx        # Route Definitionen
└── styles/
    └── globals.css       # Tailwind imports
```

### Pages Layer

```
pages/
├── home/
│   ├── HomePage.tsx
│   └── index.ts
├── events/
│   ├── EventListPage.tsx
│   ├── EventDetailPage.tsx
│   ├── EventCreatePage.tsx
│   └── index.ts
└── (auth)/              # Gruppierte Auth-Pages
    ├── login/
    ├── register/
    └── forgot-password/
```

### Widgets Layer

```
widgets/
├── dashboard/
│   ├── Dashboard.tsx
│   ├── DashboardCard.tsx
│   ├── model/
│   │   └── useDashboardData.ts
│   └── index.ts
├── event-calendar/
│   ├── EventCalendar.tsx
│   ├── CalendarEvent.tsx
│   ├── model/
│   │   └── useCalendarEvents.ts
│   └── index.ts
└── notification-center/
    ├── NotificationCenter.tsx
    ├── NotificationItem.tsx
    └── index.ts
```

### Features Layer

```
features/
├── event-management/
│   ├── EventForm.tsx
│   ├── EventList.tsx
│   ├── TaskAssignment.tsx
│   ├── model/
│   │   ├── useEventManagement.ts
│   │   ├── eventValidation.ts
│   │   └── types.ts
│   ├── api/
│   │   └── eventApi.ts
│   └── index.ts
├── auth/
│   ├── LoginForm.tsx
│   ├── LogoutButton.tsx
│   ├── ProtectedRoute.tsx
│   ├── model/
│   │   ├── useAuth.ts
│   │   ├── authStore.ts
│   │   └── types.ts
│   └── index.ts
└── member-profile/
    ├── ProfileForm.tsx
    ├── ProfileView.tsx
    ├── VisibilitySettings.tsx
    └── index.ts
```

### Entities Layer

```
entities/
├── event/
│   ├── EventCard.tsx        # UI-Komponente
│   ├── EventBadge.tsx       # UI-Komponente
│   ├── model/
│   │   ├── types.ts         # Event Interface
│   │   ├── eventStore.ts    # Zustand Store
│   │   └── eventHelpers.ts  # Utility Functions
│   ├── api/
│   │   └── eventApi.ts      # API Calls
│   └── index.ts
├── member/
│   ├── MemberAvatar.tsx
│   ├── MemberCard.tsx
│   ├── model/
│   │   └── types.ts
│   └── index.ts
└── task/
    ├── TaskItem.tsx
    ├── TaskStatus.tsx
    └── index.ts
```

### Shared Layer

```
shared/
├── api/
│   ├── apiClient.ts         # Axios/Fetch Setup
│   ├── apiTypes.ts          # Gemeinsame API Types
│   └── apiHooks.ts          # Gemeinsame Hooks
├── ui/
│   ├── Button.tsx           # Base Components
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── index.ts
├── lib/
│   ├── generateId.ts        # ID Generator
│   ├── dateHelpers.ts       # Date Utils
│   ├── validation.ts        # Validation Utils
│   └── constants.ts         # App Constants
└── hooks/
    ├── useDebounce.ts
    ├── useLocalStorage.ts
    └── useMediaQuery.ts
```

## Import-Regeln

### Dependency Rule

Imports dürfen nur von oben nach unten erfolgen:

```typescript
// ✅ Erlaubt
// pages/events/EventListPage.tsx
import { EventList } from "@/features/event-management";
import { EventCard } from "@/entities/event";
import { Button } from "@/shared/ui";

// ❌ Verboten
// entities/event/EventCard.tsx
import { EventList } from "@/features/event-management"; // Feature → Entity
```

### Import-Hierarchie

1. **App** → kann alles importieren
2. **Pages** → Widgets, Features, Entities, Shared
3. **Widgets** → Features, Entities, Shared
4. **Features** → Entities, Shared
5. **Entities** → Shared
6. **Shared** → nichts (leaf layer)

## Praktische Beispiele

### Entity: Event

```typescript
// entities/event/model/types.ts
export interface Event {
  id: string
  titel: string
  datum: Date
  status: EventStatus
  // ...
}

// entities/event/api/eventApi.ts
import { apiClient } from '@/shared/api'
import type { Event } from '../model/types'

export const eventApi = {
  getAll: () => apiClient.get<Event[]>('/events'),
  getById: (id: string) => apiClient.get<Event>(`/events/${id}`),
  create: (event: Omit<Event, 'id'>) => apiClient.post('/events', event)
}

// entities/event/EventCard.tsx
import { Card } from '@/shared/ui'
import type { Event } from './model/types'

export const EventCard = ({ event }: { event: Event }) => {
  return (
    <Card>
      <h3>{event.titel}</h3>
      <p>{event.datum.toLocaleDateString()}</p>
    </Card>
  )
}

// entities/event/index.ts
export { EventCard, EventBadge } from './'
export { eventApi } from './api/eventApi'
export type { Event, EventStatus } from './model/types'
```

### Feature: Event Management

```typescript
// features/event-management/model/useEventManagement.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventApi } from '@/entities/event'
import { generateId } from '@/shared/lib'

export const useEventManagement = () => {
  const queryClient = useQueryClient()

  const createEvent = useMutation({
    mutationFn: async (data: CreateEventData) => {
      const event = {
        ...data,
        id: generateId('evt'),
        status: 'ENTWURF'
      }
      return eventApi.create(event)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })

  return { createEvent }
}

// features/event-management/EventForm.tsx
import { useForm } from 'react-hook-form'
import { Button, Input } from '@/shared/ui'
import { useEventManagement } from './model/useEventManagement'

export const EventForm = () => {
  const { createEvent } = useEventManagement()
  const form = useForm()

  const onSubmit = (data) => {
    createEvent.mutate(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('titel')} />
      <Button type="submit">Event erstellen</Button>
    </form>
  )
}
```

### Widget: Dashboard

```typescript
// widgets/dashboard/Dashboard.tsx
import { useAuth } from '@/features/auth'
import { EventList } from '@/features/event-management'
import { TaskList } from '@/features/task-management'
import { Card } from '@/shared/ui'

export const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card title="Meine Events">
        <EventList userId={user.id} />
      </Card>
      <Card title="Meine Aufgaben">
        <TaskList userId={user.id} />
      </Card>
    </div>
  )
}
```

### Page: Event List

```typescript
// pages/events/EventListPage.tsx
import { PageLayout } from '@/widgets/layout'
import { EventFilters, EventList } from '@/features/event-management'
import { Button } from '@/shared/ui'
import { useNavigate } from '@tanstack/react-router'

export const EventListPage = () => {
  const navigate = useNavigate()

  return (
    <PageLayout
      title="Veranstaltungen"
      actions={
        <Button onClick={() => navigate({ to: '/events/new' })}>
          Event erstellen
        </Button>
      }
    >
      <EventFilters />
      <EventList />
    </PageLayout>
  )
}
```

## Testing-Struktur

Tests liegen neben den Komponenten:

```
features/event-management/
├── EventForm.tsx
├── EventForm.test.tsx
├── model/
│   ├── useEventManagement.ts
│   └── useEventManagement.test.ts
└── index.ts
```

## Best Practices

### 1. Single Responsibility

Jede Komponente/Funktion hat genau eine Aufgabe.

### 2. Composition over Inheritance

Nutze Component Composition statt Vererbung.

### 3. Explicit Exports

Exportiere nur was extern genutzt werden soll.

### 4. Type Safety

Nutze TypeScript durchgängig mit strikten Types.

### 5. Consistent Naming

- Components: PascalCase
- Hooks: camelCase mit `use` Prefix
- Types/Interfaces: PascalCase
- Files: Wie der Export

## Migration Guide

Bei Migration von klassischer Struktur zu FSD:

1. **Entities zuerst**: Basis-Komponenten und Types
2. **Features danach**: Business Logic
3. **Widgets**: Zusammengesetzte UI
4. **Pages zuletzt**: Routing und Layout

## Checkliste für neue Features

- [ ] In welchen Layer gehört das Feature?
- [ ] Welche Entities werden benötigt?
- [ ] Gibt es wiederverwendbare UI in Shared?
- [ ] Sind alle Imports regelkonform?
- [ ] Ist die index.ts aktualisiert?
- [ ] Sind Tests vorhanden?

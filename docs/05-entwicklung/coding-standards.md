# Coding Standards

## Allgemeine Prinzipien

### 1. Code-Qualität

- **Clean Code**: Lesbarkeit über Cleverness
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **YAGNI**: You Aren't Gonna Need It
- **Boy Scout Rule**: Code besser hinterlassen als vorgefunden

### 2. Naming Conventions

#### TypeScript/JavaScript

```typescript
// Komponenten: PascalCase
export const EventCard = () => {};

// Funktionen/Hooks: camelCase
export const useEventData = () => {};
export const calculateTotal = () => {};

// Konstanten: UPPER_SNAKE_CASE
export const MAX_TEILNEHMER = 100;
export const API_TIMEOUT = 30000;

// Types/Interfaces: PascalCase
export interface Event {}
export type EventStatus = "draft" | "active";

// Enums: PascalCase mit UPPER_SNAKE_CASE Werten
export enum EventStatus {
  ENTWURF = "entwurf",
  AKTIV = "aktiv",
}

// Private Funktionen: underscore prefix
const _helperFunction = () => {};

// Boolean Variablen: is/has/can prefix
const isActive = true;
const hasPermission = false;
const canEdit = true;
```

#### Dateinamen

```
// Komponenten: PascalCase.tsx
EventCard.tsx
EventDetailPage.tsx

// TypeScript Module: camelCase.ts
eventService.ts
dateHelpers.ts

// Tests: name.test.ts oder name.spec.ts
EventCard.test.tsx
eventService.test.ts

// Styles: name.module.css (wenn CSS Modules)
EventCard.module.css
```

### 3. Projekt-spezifische Konventionen

#### Keine Pluralisierung

```typescript
// ❌ Falsch
interface Events {}
const EventsPage = () => {};

// ✅ Richtig
interface EventList {}
const EventListPage = () => {};
```

#### Deutsche Domain-Begriffe

```typescript
// Domain-Entitäten auf Deutsch
interface Mitglied {}
interface Aufgabe {}
interface Veranstaltung {}

// Technische Begriffe auf Englisch
interface ApiResponse {}
class EventController {}
```

#### Frontend-generierte IDs

```typescript
import { generateId } from "@/shared/lib";

// Bei Create immer ID generieren
const createEvent = (data: CreateEventData) => {
  const event = {
    ...data,
    id: generateId("evt"), // evt_1234567890abcdef
    erstelltAm: new Date(),
  };
  return api.post("/events", event);
};
```

## TypeScript

### 1. Types vs Interfaces

```typescript
// ✅ Type für Union Types, Funktionen, Utilities
type EventStatus = "draft" | "active" | "cancelled";
type EventHandler = (event: Event) => void;
type Nullable<T> = T | null;

// ✅ Interface für Objekte (erweiterbar)
interface Event {
  id: string;
  titel: string;
}

// Interface erweitern
interface DetailedEvent extends Event {
  beschreibung: string;
}
```

### 2. Strict Mode

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true
  }
}
```

### 3. Type Guards

```typescript
// Type Predicate
const isEvent = (obj: unknown): obj is Event => {
  return (
    typeof obj === "object" && obj !== null && "id" in obj && "titel" in obj
  );
};

// Discriminated Unions
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

const handleResponse = <T>(response: ApiResponse<T>) => {
  if (response.success) {
    // TypeScript weiß: response.data existiert
    return response.data;
  }
  // TypeScript weiß: response.error existiert
  throw new Error(response.error.message);
};
```

## React

### 1. Component Patterns

#### Functional Components mit TypeScript

```typescript
// Props als Interface
interface EventCardProps {
  event: Event
  onSelect?: (id: string) => void
  className?: string
}

// Expliziter Return Type
export const EventCard: FC<EventCardProps> = ({
  event,
  onSelect,
  className
}) => {
  return (
    <Card className={className} onClick={() => onSelect?.(event.id)}>
      <h3>{event.titel}</h3>
    </Card>
  )
}

// Mit Default Props
EventCard.defaultProps = {
  className: ''
}
```

#### Component Composition

```typescript
// Parent Component mit Composition
export const EventForm = ({ children }: PropsWithChildren) => {
  return <form>{children}</form>
}

// Sub-Components
EventForm.Header = ({ title }: { title: string }) => <h2>{title}</h2>
EventForm.Body = ({ children }: PropsWithChildren) => <div>{children}</div>
EventForm.Footer = ({ children }: PropsWithChildren) => <footer>{children}</footer>

// Usage
<EventForm>
  <EventForm.Header title="Neues Event" />
  <EventForm.Body>
    <Input name="titel" />
  </EventForm.Body>
  <EventForm.Footer>
    <Button type="submit">Speichern</Button>
  </EventForm.Footer>
</EventForm>
```

### 2. Hooks

#### Custom Hooks

```typescript
// Immer use-Prefix
export const useEventData = (eventId: string) => {
  const [data, setData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const event = await eventApi.getById(eventId);
        setData(event);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  return { data, loading, error };
};
```

#### Rules of Hooks

```typescript
// ❌ Falsch - Conditional Hook
if (condition) {
  useEffect(() => {}, []);
}

// ✅ Richtig - Hook mit Condition
useEffect(() => {
  if (condition) {
    // logic
  }
}, [condition]);
```

### 3. Performance

#### Memoization

```typescript
// React.memo für expensive Components
export const ExpensiveList = memo(({ items }: { items: Item[] }) => {
  return items.map(item => <ExpensiveItem key={item.id} {...item} />)
})

// useMemo für expensive Berechnungen
const sortedEvents = useMemo(
  () => events.sort((a, b) => a.datum - b.datum),
  [events]
)

// useCallback für stable Funktionen
const handleSubmit = useCallback((data: FormData) => {
  api.post('/events', data)
}, [])
```

## Error Handling

### 1. Try-Catch Pattern

```typescript
// Service Layer
export const eventService = {
  async create(data: CreateEventData): Promise<Event> {
    try {
      const response = await api.post("/events", data);
      return response.data;
    } catch (error) {
      // Logging für Entwicklung
      console.error("[EventService] Create failed:", error);

      // User-freundliche Fehlermeldung
      if (error instanceof ApiError) {
        throw new Error(getErrorMessage(error.code));
      }

      throw new Error("Event konnte nicht erstellt werden");
    }
  },
};

// Component Layer
const handleSubmit = async (data: FormData) => {
  try {
    await eventService.create(data);
    toast.success("Event erfolgreich erstellt");
    navigate("/events");
  } catch (error) {
    toast.error(error.message);
  }
};
```

### 2. Error Boundaries

```typescript
export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to error service
    errorService.log(error, info)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}
```

## Testing

### 1. Unit Tests

```typescript
// Component Test
describe('EventCard', () => {
  const mockEvent: Event = {
    id: 'evt_123',
    titel: 'Test Event',
    datum: new Date('2024-06-15')
  }

  it('sollte Event-Titel anzeigen', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('Test Event')).toBeInTheDocument()
  })

  it('sollte onSelect mit Event-ID aufrufen', () => {
    const onSelect = vi.fn()
    render(<EventCard event={mockEvent} onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('article'))
    expect(onSelect).toHaveBeenCalledWith('evt_123')
  })
})

// Hook Test
describe('useEventData', () => {
  it('sollte Event-Daten laden', async () => {
    const { result } = renderHook(() => useEventData('evt_123'))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toEqual(mockEvent)
    })
  })
})
```

### 2. Integration Tests

```typescript
describe('Event Creation Flow', () => {
  it('sollte neues Event erstellen können', async () => {
    const user = userEvent.setup()

    render(<EventCreatePage />)

    // Formular ausfüllen
    await user.type(screen.getByLabelText('Titel'), 'Neues Event')
    await user.selectOptions(screen.getByLabelText('Typ'), 'fanfahrt')

    // Absenden
    await user.click(screen.getByRole('button', { name: 'Erstellen' }))

    // Weiterleitung prüfen
    await waitFor(() => {
      expect(window.location.pathname).toBe('/events')
    })
  })
})
```

## Code-Dokumentation

### 1. JSDoc

```typescript
/**
 * Erstellt ein neues Event
 *
 * @param data - Event-Daten ohne ID
 * @returns Promise mit der generierten Event-ID
 *
 * @example
 * const { id } = await createEvent({
 *   titel: 'Fanfahrt',
 *   datum: new Date('2024-06-15')
 * })
 *
 * @throws {ValidationError} Bei ungültigen Daten
 * @throws {AuthorizationError} Bei fehlenden Rechten
 */
export const createEvent = async (
  data: Omit<Event, "id">,
): Promise<{ id: string }> => {
  // Implementation
};
```

### 2. Inline Comments

```typescript
// Komplexe Logik erklären
const calculateEventScore = (event: Event): number => {
  let score = 0;

  // Basis-Score nach Teilnehmerzahl
  score += Math.min(event.teilnehmer.length * 10, 100);

  // Bonus für vollständige Beschreibung
  if (event.beschreibung.length > 200) {
    score += 20;
  }

  // Penalty für kurzfristige Events
  const daysUntil = differenceInDays(event.datum, new Date());
  if (daysUntil < 7) {
    score *= 0.8; // 20% Abzug
  }

  return Math.round(score);
};
```

## Git Commit Messages

### Format

```
type(scope): Kurze Beschreibung

Längere Beschreibung wenn nötig

Closes #123
```

### Types

- **feat**: Neue Features
- **fix**: Bugfixes
- **docs**: Dokumentation
- **style**: Formatierung (kein Code-Change)
- **refactor**: Code-Refactoring
- **test**: Tests hinzufügen/ändern
- **chore**: Maintenance, Dependencies

### Beispiele

```
feat(event): Event-Erstellung implementiert

- Formular mit Validierung
- API-Integration
- Optimistische Updates

Closes #42
```

```
fix(auth): Login-Fehler bei Token-Expire behoben
```

```
docs(api): Endpoint-Dokumentation aktualisiert
```

## Checkliste Code Review

- [ ] Folgt den Naming Conventions?
- [ ] TypeScript Types vollständig?
- [ ] Error Handling vorhanden?
- [ ] Tests geschrieben/angepasst?
- [ ] Dokumentation aktualisiert?
- [ ] Keine Console.logs im Production Code?
- [ ] Performance-Überlegungen?
- [ ] Accessibility berücksichtigt?
- [ ] Mobile-Ansicht getestet?
- [ ] Keine Secrets im Code?

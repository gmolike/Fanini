# SHARED COMPONENTS CATALOG - Faninitiative Spandau

## Umfassende Dokumentation für KI & Entwickler

---

## 🎨 ANIMATED COMPONENTS

### AnimatedValue

**Pfad:** `@/shared/ui/animated/AnimatedValue` **Use Case:** Zahlen animiert
hochzählen lassen oder Text mit Fade-In erscheinen lassen **Visuelles
Verhalten:** Zahlen zählen von 0 zum Zielwert hoch, Text faded sanft ein
**Code-Beispiele:**

```tsx
// Mitgliederzahl animiert anzeigen
<AnimatedValue value={847} format={(n) => `${n} Mitglieder`} delay={0.3} />

// Überschrift mit Gradient und Fade-In
<AnimatedValue delay={0.2} gradient>
  <h1>Willkommen bei der Faninitiative!</h1>
</AnimatedValue>

// Dashboard mit mehreren animierten Werten
<AnimatedValue value={42} format={(n) => n.toString()} delay={0.5} />
```

**Props:**

- `value`: Zahl die animiert werden soll
- `format`: Funktion zur Formatierung (z.B. Währung, Einheiten)
- `delay`: Verzögerung in Sekunden
- `gradient`: Vereinsfarben-Gradient für Text
- `children`: Alternativ zu value für Text-Content **Besonderheit:** Nutzt
  Framer Motion Spring-Animation für smoothe Bewegung

---

## 🔘 BUTTON COMPONENTS

### Button

**Pfad:** `@/shared/ui/button/Button` **Use Case:** Primäre Actions,
Form-Submits, sekundäre Actions **Visuelles Verhalten:** Zeigt Ladeanimation,
verschiedene Farben je nach Wichtigkeit **Code-Beispiele:**

```tsx
// Event speichern mit Loading State
<Button loading={isSaving} onClick={handleSave}>
  Event speichern
</Button>

// Destruktive Aktion
<Button variant="destructive" onClick={handleDelete}>
  <Trash2 className="mr-2 h-4 w-4" />
  Mitglied entfernen
</Button>

// Sekundäre Navigation
<Button variant="outline" size="sm">
  <Settings className="mr-2 h-4 w-4" />
  Einstellungen
</Button>
```

**Varianten:**

- `default`: Blau, für primäre Actions
- `destructive`: Rot, für Lösch-Aktionen
- `outline`: Nur Border, für sekundäre Actions
- `ghost`: Transparent, für Toolbar-Actions
- `link`: Aussehen wie ein Link **Größen:** `sm`, `default`, `lg`, `icon`
  **Besonderheit:** Deaktiviert automatisch bei `loading=true`

### ButtonGroup

**Pfad:** `@/shared/ui/button/ButtonGroup` **Use Case:** Zusammengehörige
Actions gruppieren (z.B. Bearbeiten/Löschen) **Code-Beispiel:**

```tsx
<ButtonGroup>
  <Button variant="outline">Bearbeiten</Button>
  <Button variant="outline">Duplizieren</Button>
  <Button variant="outline"><Trash2 className="h-4 w-4" /></Button>
</ButtonGroup>
```

**Props:** `orientation`: "horizontal" | "vertical"

---

## 📊 CHARTS & VISUALIZATION

### OrgChart

**Pfad:** `@/shared/ui/charts/OrgChart` **Use Case:** Vereinsstruktur darstellen
(Vorstand → Teams → Mitglieder) **Visuelles Verhalten:** Hierarchische Boxen mit
Verbindungslinien, farbcodiert nach Typ **Code-Beispiel:**

```tsx
const vereinsStruktur: OrgChartNode[] = [
  {
    id: '1',
    label: 'Vorstand',
    department: 'Vereinsführung',
    level: 0,
    type: 'board', // blau
    memberCount: 5
  },
  {
    id: '2',
    label: 'Team Event',
    department: 'Veranstaltungen',
    level: 1,
    type: 'team', // grau
    parentId: '1',
    memberCount: 12
  }
];

<OrgChart
  nodes={vereinsStruktur}
  expandable // Erlaubt Ebenen ein-/ausklappen
  onNodeClick={(node) => navigateToTeam(node.id)}
/>
```

**Node Types:**

- `board`: Blau mit Gradient
- `advisory`: Rot mit Gradient
- `team`: Grau **Besonderheit:** Zeigt Mitgliederzahl, animierte Hover-Effekte

### WorkflowChart

**Pfad:** `@/shared/ui/charts/WorkflowChart` **Use Case:**
Event-Genehmigungsprozess, Aufgaben-Workflows visualisieren **Visuelles
Verhalten:** Timeline mit Status-Icons (✓ erledigt, ⏰ aktiv, ○ ausstehend)
**Code-Beispiel:**

```tsx
const eventWorkflow: WorkflowStep[] = [
  {
    id: '1',
    label: 'Event erstellen',
    description: 'Team Event legt neues Event an',
    status: 'completed',
    assignee: 'Max Mustermann'
  },
  {
    id: '2',
    label: 'Genehmigung Beirat',
    description: 'Beirat prüft und genehmigt',
    status: 'active',
    dueDate: '15.03.2024',
    assignee: 'Beirat'
  },
  {
    id: '3',
    label: 'Veröffentlichung',
    status: 'pending'
  }
];

<WorkflowChart
  steps={eventWorkflow}
  orientation="vertical" // oder "horizontal"
  onStepClick={(step) => openStepDetails(step.id)}
/>
```

**Status-Farben:**

- `completed`: Grün mit Checkmark
- `active`: Blau mit Uhr (pulsiert)
- `pending`: Grau mit Kreis
- `error`: Rot mit Warnung

### RACIMatrix

**Pfad:** `@/shared/ui/charts/RACIMatrix` **Use Case:** Verantwortlichkeiten für
Event-Aufgaben definieren **Code-Beispiel:**

```tsx
const eventVerantwortung: RACIAssignment[] = [
  {
    taskId: '1',
    taskName: 'Event-Konzept erstellen',
    assignments: new Map([
      ['Max', 'responsible'],   // R - macht die Arbeit
      ['Anna', 'accountable'],  // A - trägt Verantwortung
      ['Tom', 'consulted']      // C - wird befragt
    ])
  }
];

<RACIMatrix
  assignments={eventVerantwortung}
  people={['Max', 'Anna', 'Tom', 'Lisa']}
  onCellClick={(task, person, role) => updateAssignment()}
/>
```

**RACI-Rollen:**

- R (Responsible): Blau - Durchführung
- A (Accountable): Grün - Verantwortung
- C (Consulted): Gelb - Beratend
- I (Informed): Grau - Informiert

---

## 📦 LAYOUT COMPONENTS

### Container

**Pfad:** `@/shared/ui/container/Container` **Use Case:** Content-Breite
konsistent halten über alle Seiten **Code-Beispiele:**

```tsx
// Standard-Breite für Content
<Container>
  <h1>Vereinsübersicht</h1>
  <p>Content mit max-width und responsive padding</p>
</Container>

// Volle Breite für Hero-Sections
<Container size="full" className="bg-gradient-to-r from-blue-500 to-red-500">
  <HeroContent />
</Container>
```

**Sizes:**

- `sm`: max-w-3xl (768px)
- `default`: max-w-5xl (1024px)
- `lg`: max-w-7xl (1280px)
- `xl`: max-w-screen-xl (1280px)
- `full`: keine Begrenzung

### PageHeader

**Pfad:** `@/shared/ui/layout/PageHeader` **Use Case:** Konsistente
Seiten-Header mit Titel, Breadcrumb und Actions **Code-Beispiele:**

```tsx
// Event-Verwaltungsseite
<PageHeader
  title="Events verwalten"
  description="12 anstehende, 35 vergangene Events"
  breadcrumb={
    <Breadcrumb items={[
      { label: 'Start', href: '/' },
      { label: 'Events', href: '/events' },
      { label: 'Verwalten' }
    ]} />
  }
  actions={
    <>
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Button size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Neues Event
      </Button>
    </>
  }
/>

// Hero-Variante für Landing Page
<PageHeader
  variant="hero"
  title="Willkommen bei der Faninitiative Spandau"
  description="Gemeinsam für Eintracht Spandau"
/>
```

**Varianten:**

- `default`: Weißer Hintergrund mit Border
- `hero`: Blauer Gradient, weiße Schrift
- `minimal`: Transparent, nur Text

### PageSection

**Pfad:** `@/shared/ui/layout/PageSection` **Use Case:** Inhaltsbereiche mit
konsistentem Spacing und Hintergrund **Code-Beispiel:**

```tsx
<PageSection>
  <h2>Aktuelle Events</h2>
  <EventList />
</PageSection>

<PageSection variant="muted">
  <h2>Vereinsstatistik</h2>
  <StatsDashboard />
</PageSection>
```

**Varianten:**

- `default`: Normaler Hintergrund
- `muted`: Grauer Hintergrund für Abgrenzung
- `accent`: Leicht gefärbter Hintergrund

---

## 🏷️ DISPLAY COMPONENTS

### BooleanDisplay

**Pfad:** `@/shared/ui/display/BooleanDisplay` **Use Case:** Mitgliedsstatus,
Vertraulichkeitserklärung, Event-Öffentlichkeit **Code-Beispiele:**

```tsx
// Mitglied aktiv/inaktiv als Icon
<BooleanDisplay value={member.istAktiv} variant="icon" />

// Vertraulichkeitserklärung als Text
<BooleanDisplay
  value={member.hatVertraulichkeitserklaerung}
  variant="text"
  trueLabel="Unterschrieben"
  falseLabel="Ausstehend"
/>

// Ohne Farbe für subtile Anzeige
<BooleanDisplay value={event.istOeffentlich} withColor={false} />
```

**Darstellung:**

- Icon-Variante: ✓ (grün) oder ✗ (rot)
- Text-Variante: "Ja"/"Nein" oder custom Labels

### DateDisplay

**Pfad:** `@/shared/ui/display/DateDisplay` **Use Case:** Event-Datum, Mitglied
seit, Fälligkeiten **Code-Beispiele:**

```tsx
// Event-Datum kurz
<DateDisplay date={event.datum} format="short" /> // "15.03.2024"

// Mit Icon für Listen
<DateDisplay
  date={member.mitgliedSeit}
  format="medium"
  withIcon
/> // 📅 15. März 2024

// Ausführlich für Details
<DateDisplay
  date={event.datum}
  format="long"
/> // "Samstag, 15. März 2024"
```

**Formate:**

- `short`: "15.03.2024"
- `medium`: "15. März 2024"
- `long`: "Samstag, 15. März 2024"
- `relative`: Später implementierbar für "vor 2 Tagen"

### EmailDisplay & PhoneDisplay

**Pfad:** `@/shared/ui/display/EmailDisplay|PhoneDisplay` **Use Case:**
Kontaktdaten in Mitgliederlisten und Profilen **Code-Beispiele:**

```tsx
// Klickbare E-Mail mit Icon
<EmailDisplay
  email={member.email}
  withIcon
  asLink
/> // ✉️ max@fanini-spandau.de

// Telefon ohne Link (Datenschutz)
<PhoneDisplay
  phone={member.telefon}
  asLink={false}
  withIcon
/> // 📞 030 123456
```

**Besonderheit:** Respektiert Sichtbarkeitseinstellungen der Mitglieder

---

## 🎯 ENUM COMPONENTS

### EnumBadge & EnumLabel

**Pfad:** `@/shared/ui/enum/EnumBadge|EnumLabel` **Use Case:** Type-safe
Darstellung von Event-Status, Mitglieder-Rollen, Aufgaben-Prioritäten **Setup &
Code-Beispiel:**

```tsx
// 1. Enum definieren
const EventStatus = {
  DRAFT: 'Entwurf',
  PLANNED: 'Geplant',
  APPROVED: 'Genehmigt',
  ACTIVE: 'Aktiv',
  COMPLETED: 'Abgeschlossen',
  CANCELLED: 'Abgesagt'
} as const;

// 2. Config mit Farben erstellen
const eventStatusConfig = createEnumVariantConfig(EventStatus, {
  DRAFT: 'default',      // grau
  PLANNED: 'info',       // blau
  APPROVED: 'success',   // grün
  ACTIVE: 'warning',     // gelb
  COMPLETED: 'default',  // grau
  CANCELLED: 'error'     // rot
});

// 3. Als Badge anzeigen (farbig)
<EnumBadge value={event.status} config={eventStatusConfig} />

// 4. Als Text anzeigen
<EnumLabel value={event.status} config={eventStatusConfig} />

// Mitglieder-Rollen Beispiel
const roleConfig = createEnumVariantConfig(MemberRole, {
  ADMIN: 'purple',
  BOARD: 'success',
  MEMBER: 'default',
  GUEST: 'outline'
});
```

**Verfügbare Farben:**

- `default`: Grau
- `success`: Grün
- `warning`: Gelb
- `error`: Rot
- `info`: Blau
- `purple`: Lila
- `outline`: Nur Border

---

## ✨ EFFECT COMPONENTS

### FloatingCard

**Pfad:** `@/shared/ui/float/FloatingCard` **Use Case:** Creator-Profile,
Team-Karten, Feature-Highlights **Visuelles Verhalten:** Karte neigt sich zur
Mausposition (3D-Effekt) **Code-Beispiel:**

```tsx
<FloatingCard intensity={15}>
  <div className="rounded-xl bg-white p-6 shadow-xl">
    <img src={creator.profilbild} className="w-full rounded-lg" />
    <h3>{creator.kuenstlername}</h3>
    <p>{creator.beschreibung}</p>
  </div>
</FloatingCard>
```

**Props:** `intensity`: 5-20 (Stärke der Neigung)

### GlassCard

**Pfad:** `@/shared/ui/glass/GlassCard` **Use Case:** Overlays über Bildern,
moderne UI-Elemente **Visuelles Verhalten:** Semi-transparenter Hintergrund mit
Blur **Code-Beispiel:**

```tsx
// Login-Form über Hero-Bild
<div className="relative">
  <img src="/hero.jpg" className="w-full" />
  <GlassCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <LoginForm />
  </GlassCard>
</div>
```

**Besonderheit:** Funktioniert am besten vor bunten Hintergründen

### ParallaxCard

**Pfad:** `@/shared/ui/parallax/ParallaxCard` **Use Case:** Landing Page
Sections, Storytelling **Visuelles Verhalten:** Bewegt sich langsamer beim
Scrollen als der Rest **Code-Beispiel:**

```tsx
<ParallaxCard offset={60}>
  <div className="rounded-lg bg-blue-500 p-8 text-white">
    <h2>Unsere Mission</h2>
    <p>Gemeinsam für Eintracht Spandau...</p>
  </div>
</ParallaxCard>
```

**Props:** `offset`: 30-100 (Bewegungsunterschied in Pixeln)

---

## 🔄 STATE MANAGEMENT

### LoadingState

**Pfad:** `@/shared/ui/loadingState/LoadingState` **Use Case:** MUSS für alle
TanStack Query Results verwendet werden **Visuelles Verhalten:** Zeigt
automatisch Spinner → Error → Empty → Content **Code-Beispiel:**

```tsx
// Standard-Pattern für Daten laden
const memberQuery = useQuery({
  queryKey: ['member', memberId],
  queryFn: () => fetchMember(memberId)
});

return (
  <LoadingState query={memberQuery}>
    {(member) => (
      <MemberProfile member={member} />
    )}
  </LoadingState>
);

// Mit custom Fallbacks
<LoadingState
  query={eventsQuery}
  loadingFallback={<EventListSkeleton />}
  errorFallback={<Alert>Events konnten nicht geladen werden</Alert>}
  emptyFallback={<EmptyState message="Keine Events vorhanden" />}
>
  {(events) => <EventList events={events} />}
</LoadingState>
```

**Automatisches Verhalten:**

- `isLoading`: Zeigt Spinner
- `isError`: Zeigt Fehlermeldung
- `data === null`: Zeigt "Keine Daten"
- `data vorhanden`: Rendert children-Funktion

### ErrorBoundary

**Pfad:** `@/shared/ui/feedback/ErrorBoundary` **Use Case:** Kritische
UI-Bereiche absichern **Code-Beispiel:**

```tsx
<ErrorBoundary>
  <EventRegistrationForm />
</ErrorBoundary>
```

---

## 🎛️ FORM COMPONENTS

### ModernSelect

**Pfad:** `@/shared/ui/select/ModernSelect` **Use Case:** Dropdowns ohne
hässliche Borders, modern und clean **Code-Beispiel:**

```tsx
// Team-Auswahl
<ModernSelect value={teamId} onValueChange={setTeamId}>
  <ModernSelectTrigger className="w-[250px]">
    <SelectValue placeholder="Team wählen..." />
  </ModernSelectTrigger>
  <ModernSelectContent>
    <SelectItem value="team-event">Team Event</SelectItem>
    <SelectItem value="team-medien">Team Medien</SelectItem>
    <SelectItem value="team-technik">Team Technik</SelectItem>
  </ModernSelectContent>
</ModernSelect>

// Mit Gruppen für viele Optionen
<ModernSelectContent>
  <SelectGroup>
    <SelectLabel>Aktive Teams</SelectLabel>
    <SelectItem value="1">Team Event</SelectItem>
    <SelectItem value="2">Team Medien</SelectItem>
  </SelectGroup>
  <SelectSeparator />
  <SelectGroup>
    <SelectLabel>Inaktive Teams</SelectLabel>
    <SelectItem value="3">Team Sport</SelectItem>
  </SelectGroup>
</ModernSelectContent>
```

---

## 📑 NAVIGATION

### ModernTabs

**Pfad:** `@/shared/ui/modernTabs/ModernTabs` **Use Case:** Event-Details,
Einstellungen, mehrteilige Formulare **Code-Beispiel:**

```tsx
const eventTabs: ModernTabItem[] = [
  {
    value: 'overview',
    label: 'Übersicht',
    icon: Info,
    content: <EventOverview event={event} />
  },
  {
    value: 'participants',
    label: 'Teilnehmer',
    shortLabel: 'TN', // Für Mobile
    icon: Users,
    content: <ParticipantList eventId={event.id} />
  },
  {
    value: 'tasks',
    label: 'Aufgaben',
    icon: CheckSquare,
    content: <TaskList eventId={event.id} />
  }
];

<ModernTabs
  items={eventTabs}
  defaultValue="overview"
  variant="default" // oder "pills" für Einstellungen
/>
```

**Responsive:** Zeigt shortLabel auf Mobile, passt Grid an Anzahl Tabs an
**Varianten:**

- `default`: Underline-Style für Content
- `pills`: Gefüllte Pills für Settings

---

## 📊 DATA COMPONENTS

### DataField & DataGrid

**Pfad:** `@/shared/ui/data-display` **Use Case:** Strukturierte Daten in
Profilen, Detail-Ansichten **Code-Beispiel:**

```tsx
// Mitgliederprofil
<DataGrid columns={2} bordered>
  <DataField
    label="Name"
    value={member.vorname + ' ' + member.nachname}
    icon={<User className="h-4 w-4" />}
  />
  <DataField
    label="E-Mail"
    value={member.email}
    icon={<Mail className="h-4 w-4" />}
    highlightEmpty // Rot wenn leer
  />
  <DataField
    label="Mitglied seit"
    value={<DateDisplay date={member.mitgliedSeit} format="medium" />}
    icon={<Calendar className="h-4 w-4" />}
  />
  <DataField
    label="Rolle"
    value={<EnumBadge value={member.rolle} config={roleConfig} />}
  />
</DataGrid>

// Event-Statistik ohne Border
<DataGrid columns={3} bordered={false}>
  <DataField label="Anmeldungen" value="42" />
  <DataField label="Warteliste" value="5" />
  <DataField label="Freie Plätze" value="13" />
</DataGrid>
```

**Props:**

- `columns`: 1-4 (responsive Grid)
- `bordered`: Mit/ohne Rahmen
- `highlightEmpty`: Markiert leere Pflichtfelder

---

## 🎨 UTILITY COMPONENTS

### ThemeToggle

**Pfad:** `@/shared/ui/themetoggle/ThemeToggle` **Use Case:** Dark/Light Mode
Umschalter im Header **Code-Beispiel:**

```tsx
<header className="flex justify-between p-4">
  <Logo />
  <div className="flex items-center gap-4">
    <UserMenu />
    <ThemeToggle />
  </div>
</header>
```

**Modi:** Light, Dark, System (folgt OS-Einstellung) **Besonderheit:** Speichert
Präferenz in localStorage

### Image

**Pfad:** `@/shared/ui/image/Image`  
**Use Case:** Alle Bilder in der App (Events, Profile, Galerien)
**Code-Beispiel:**

```tsx
// Event-Hero mit Aspect Ratio
<Image
  src={event.bildUrl}
  alt={event.titel}
  aspectRatio="16:9"
  className="w-full rounded-lg"
/>

// Profilbild mit Fallback
<Image
  src={member.profilbild}
  alt={member.name}
  fallbackSrc="/images/default-avatar.jpg"
  aspectRatio="1:1"
  className="h-24 w-24 rounded-full"
/>

// Mit Blur-Placeholder für smooth loading
<Image
  src={hochaufloesend.jpg}
  alt="Vereinsheim"
  blurDataUrl="data:image/jpeg;base64,/9j/4AAQ..."
  loading="lazy"
/>
```

**Features:**

- Lazy Loading
- Fehlerbehandlung mit Fallback
- Blur-Placeholder
- Aspect Ratio Erhaltung

### PdfViewer

**Pfad:** `@/shared/ui/document/PdfViewer` **Use Case:** Satzung, Protokolle,
Dokumente anzeigen **Code-Beispiel:**

```tsx
<PdfViewer
  url="/documents/satzung.pdf"
  title="Vereinssatzung"
  className="h-[600px]"
/>
```

**Features:** Inline-Anzeige, Download-Button, Vollbild-Option

### ModernTimeline

**Pfad:** `@/shared/ui/timeline/ModernTimeline` **Use Case:** Jahresauswahl für
Event-Archiv, Statistiken **Code-Beispiel:**

```tsx
const [selectedYear, setSelectedYear] = useState(2024);

<ModernTimeline
  years={[2020, 2021, 2022, 2023, 2024, 2025]}
  selectedYear={selectedYear}
  onYearChange={(year) => {
    setSelectedYear(year);
    loadEventsForYear(year);
  }}
/>
```

**Visuelles:** Kreise für Jahre, aktives Jahr mit Gradient und größer
**Responsive:** Grid auf Mobile, Flex auf Desktop

---

## 🔌 IMPORT PATTERNS

```tsx
// Hauptimport für häufig genutzte Komponenten
import { Button, Container, PageHeader, LoadingState } from '@/shared/ui';

// Spezifische Imports für bessere Tree-Shaking
import { AnimatedValue } from '@/shared/ui/animated';
import { EnumBadge, createEnumVariantConfig } from '@/shared/ui/enum';
import { OrgChart, WorkflowChart } from '@/shared/ui/charts';

// Typ-Imports
import type { ModernTabItem } from '@/shared/ui/modernTabs';
import type { OrgChartNode } from '@/shared/ui/charts';
```

---

## ⚠️ WICHTIGE HINWEISE

1. **LoadingState ist PFLICHT** für alle Query-Results
2. **EnumBadge braucht immer eine Config** - nie direkt verwenden
3. **Container** sollte um jeden Page-Content
4. **Vereinsfarben:**
   - Blau: `var(--color-fanini-blue)`
   - Rot: `var(--color-fanini-red)`
5. **Icons:** Immer von `lucide-react` importieren
6. **Responsive:** Alle Komponenten sind mobile-first designed

---

## 🎯 ENTSCHEIDUNGSHILFE

**Brauche ich einen Button?** → Default Button, außer: Löschen = destructive,
Sekundär = outline

**Wie zeige ich Status/Rollen?** → EnumBadge mit Config für Farben

**Wie strukturiere ich eine Seite?** → PageHeader → PageSection(s) mit Container

**Wie zeige ich Daten aus der API?** → IMMER mit LoadingState wrappen

**Brauche ich einen speziellen Effekt?** → FloatingCard für Hover, GlassCard für
Overlays, ParallaxCard für Scroll

**Wie zeige ich Prozesse/Hierarchien?** → WorkflowChart für Prozesse, OrgChart
für Hierarchien

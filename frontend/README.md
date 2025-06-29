# Frontend - Faninitiative Spandau e.V.

<div align="center">
  <img src="../docs/logo.svg" alt="Faninitiative Spandau Logo" width="150" />
  
  [![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)
  [![FSD](https://img.shields.io/badge/Architecture-FSD-FF4785.svg)](https://feature-sliced.design/)
</div>

## 🎯 Übersicht

React 19 Frontend mit Feature-Sliced Design (FSD) Architektur für die Vereinsplattform der Faninitiative Spandau e.V.

## 🏗️ Architektur: Feature-Sliced Design

### Layer-Hierarchie

```
app/       → Anwendungs-Konfiguration (Provider, Router)
  ↓
pages/     → Route-Komponenten
  ↓
widgets/   → Zusammengesetzte UI-Blöcke
  ↓
features/  → Business-Features (User Stories)
  ↓
entities/  → Business-Entities (Domain Models)
  ↓
shared/    → Geteilter Code (UI-Kit, Utils, APIs)
```

### Import-Regeln

```typescript
// ✅ Erlaubt: Import aus public API
import { UserProfile } from '@/features/user-authentication';
import { Button } from '@/shared/shadcn';

// ❌ Verboten: Deep imports
import { UserProfile } from '@/features/user-authentication/ui/UserProfile';

// ❌ Verboten: Cross-imports zwischen Features
// In features/event-management:
import { Something } from '@/features/user-profile'; // Nicht erlaubt!
```

## 🚀 Quick Start

```bash
# Im Frontend-Verzeichnis
cd frontend

# Dependencies installieren
pnpm install

# Development Server starten
pnpm dev

# Production Build
pnpm build

# Preview Production Build
pnpm preview
```

## 📁 Projektstruktur

```
frontend/src/
├── app/                    # App Layer
│   ├── providers/         # App-weite Provider
│   ├── router.ts          # Router Konfiguration
│   └── routeTree.gen.ts   # Generierte Routes
│
├── pages/                 # Pages Layer (Routes)
│   ├── ~__root.tsx       # Root Layout
│   ├── ~_public/         # Öffentliche Routes
│   └── ~app/             # Geschützte Routes
│
├── widgets/              # Widgets Layer
│   ├── Layout/          # Layout Komponenten
│   └── Gallery/         # Komplexe UI Widgets
│
├── features/            # Features Layer
│   ├── auth/           # Authentifizierung
│   ├── event-management/
│   └── member-list/
│
├── entities/           # Entities Layer
│   ├── user/
│   ├── event/
│   └── member/
│
└── shared/            # Shared Layer
    ├── config/        # App-Konfiguration
    ├── shadcn/        # shadcn/ui Komponenten
    ├── ui/            # Custom UI Komponenten
    ├── lib/           # Utilities
    └── types/         # Globale Types
```

## 🛠️ Tech Stack Details

### Core Dependencies

| Package         | Version | Zweck                   |
| --------------- | ------- | ----------------------- |
| React           | 19.0.0  | UI Framework            |
| TypeScript      | 5.7.2   | Type Safety             |
| Vite            | 6.0.1   | Build Tool              |
| TanStack Router | 1.91.4  | Type-safe Routing       |
| TanStack Query  | 5.81.5  | Server State Management |
| Tailwind CSS    | 4.1.11  | Styling                 |
| shadcn/ui       | Latest  | UI Components           |
| React Hook Form | 7.59.0  | Form Management         |
| Zod             | 3.25.67 | Schema Validation       |

### Development Tools

- **ESLint**: Mit React 19, TypeScript, und FSD Rules
- **Prettier**: Code Formatting
- **Husky**: Git Hooks
- **Commitlint**: Commit Message Linting
- **Type Coverage**: 95%+ erforderlich

## 📦 Verfügbare Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm dev:host         # Dev server mit host (für mobile tests)
pnpm dev:debug        # Dev server mit debug output

# Build & Preview
pnpm build            # Production build
pnpm build:analyze    # Build mit bundle analyzer
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # ESLint
pnpm lint:fix         # ESLint mit auto-fix
pnpm format           # Prettier formatierung
pnpm format:check     # Prettier check
pnpm type-check       # TypeScript type checking

# Testing
pnpm test             # Tests ausführen
pnpm test:watch       # Tests im watch mode
pnpm test:coverage    # Test coverage report

# Utilities
pnpm clean            # Clean build artifacts
pnpm routes:generate  # Route tree generieren
pnpm deps:update      # Dependencies updaten
pnpm type-coverage    # Type coverage report
```

## 🎨 Coding Conventions

### Dateinamen

```typescript
// Components (PascalCase)
UserProfile.tsx;
EventCard.tsx;
MemberList.tsx; // Keine Pluralisierung!

// Logic/Hooks (camelCase)
useAuth.ts;
formatDate.ts;
apiClient.ts;

// Routes (mit ~ prefix)
~index.tsx;
~_public.tsx;
~app.tsx;
```

### Component Patterns

```typescript
// ✅ Const Arrow Functions
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return <div>{user.name}</div>
}

// ✅ Types über Interfaces
type UserProfileProps = {
  user: User
  onEdit?: (user: User) => void
}

// ✅ Component Composition
<Button.Root>
  <Button.Icon>
    <PlusIcon />
  </Button.Icon>
  <Button.Text>Hinzufügen</Button.Text>
</Button.Root>
```

### FSD Public API Pattern

```typescript
// features/user-profile/index.ts
export { UserProfile } from './UserProfile';
export { useUserProfile } from './model/useUserProfile';
export type { UserProfileProps } from './model/types';

// ❌ Niemals interne Struktur exportieren!
```

## 🎯 Features & Seiten

### Öffentlicher Bereich

- **Home** (`/`): Landing Page mit Hero & Events
- **Events** (`/events`): Öffentliche Event-Übersicht
- **Über uns** (`/about`): Vereinsinformationen
- **Kontakt** (`/kontakt`): Kontaktformular
- **Impressum** (`/impressum`): Rechtliches
- **Datenschutz** (`/datenschutz`): DSGVO

### Mitgliederbereich

- **Dashboard** (`/app`): Persönliche Übersicht
- **Events** (`/app/events`): Event-Management
- **Mitglieder** (`/app/members`): Mitgliederliste
- **Profil** (`/app/profile`): Benutzerprofil
- **Einstellungen** (`/app/settings`): Kontoeinstellungen

## 🔧 Entwicklung

### Environment Variables

```env
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_DEVTOOLS=true
VITE_APP_NAME=Faninitiative Spandau e.V.
VITE_APP_VERSION=0.1.0
```

### VS Code Settings

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "eslint.workingDirectories": ["frontend"],
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Debugging

```bash
# React DevTools
# Automatisch aktiviert in development

# TanStack DevTools
# Verfügbar unter dem React logo unten rechts

# Type Coverage Report
pnpm type-coverage:detail
```

## 🎨 Design System

### Farben (Faninitiative Branding)

```css
--color-fanini-blue: #34687e;
--color-fanini-red: #b94f46;
```

### Typography

- **Headings**: Bebas Neue
- **Body**: System UI Stack

### Components

Alle UI-Komponenten basieren auf shadcn/ui mit Custom-Theming für Vereinsfarben.

## 🚀 Performance

### Optimierungen

- **Code Splitting**: Automatisch via Vite
- **React Compiler**: Babel Plugin aktiviert
- **Bundle Size**: < 200KB initial
- **Lighthouse Score**: 95+ angestrebt

### Build Analyse

```bash
pnpm build:analyze
# Öffnet Bundle Visualizer
```

## 🐛 Troubleshooting

### Route Tree Generation

```bash
# Manuell generieren
pnpm routes:generate

# Bei Problemen
rm src/app/routeTree.gen.ts
pnpm routes:generate
```

### Type Errors

```bash
# Type Coverage prüfen
pnpm type-coverage

# Strict Mode temporär deaktivieren
# tsconfig.json -> "strict": false
```

### ESLint Errors

```bash
# Auto-fix versuchen
pnpm lint:fix

# Cache löschen
rm .eslintcache
pnpm lint
```

## 📚 Weitere Dokumentation

- [FSD Architektur Guide](../docs/architecture/fsd.md)
- [Component Guidelines](../docs/components.md)
- [API Integration](../docs/api.md)
- [Testing Strategy](../docs/testing.md)

## 🤝 Contributing

1. Feature Branch erstellen
2. Code schreiben (mit Tests!)
3. Lint & Format durchführen
4. Commit mit Conventional Commits
5. Pull Request erstellen

---

<div align="center">
  <strong>Built with 💙❤️ for Eintracht Spandau</strong>
</div>

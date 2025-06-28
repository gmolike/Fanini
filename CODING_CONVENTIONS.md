# Coding Conventions - Faninitiative Spandau e.V.

## Namenskonventionen

### Dateinamen

#### ✅ Do's

- **TSX-Dateien (Komponenten)**: PascalCase
  - `UserProfile.tsx`
  - `MemberList.tsx`
  - `ArticleCard.tsx`

- **TS-Dateien (Logik/Hooks/Utils)**: camelCase
  - `useUserData.ts`
  - `validateForm.ts`
  - `apiClient.ts`

- **Index-Dateien**: lowercase
  - `index.ts`

#### ❌ Don'ts

- Keine Pluralisierung bei Komponenten
  - ❌ `Members.tsx`
  - ✅ `MemberList.tsx`

- Keine kebab-case bei TypeScript-Dateien
  - ❌ `user-profile.tsx`
  - ✅ `UserProfile.tsx`

### FSD Layer-spezifische Konventionen

#### Slice-Namen (kebab-case)

# Coding Conventions - Faninitiative Spandau e.V.

## Namenskonventionen

### Dateinamen

#### ✅ Do's

- **TSX-Dateien (Komponenten)**: PascalCase
  - `UserProfile.tsx`
  - `MemberList.tsx`
  - `ArticleCard.tsx`

- **TS-Dateien (Logik/Hooks/Utils)**: camelCase
  - `useUserData.ts`
  - `validateForm.ts`
  - `apiClient.ts`

- **Index-Dateien**: lowercase
  - `index.ts`

#### ❌ Don'ts

- Keine Pluralisierung bei Komponenten
  - ❌ `Members.tsx`
  - ✅ `MemberList.tsx`

- Keine kebab-case bei TypeScript-Dateien
  - ❌ `user-profile.tsx`
  - ✅ `UserProfile.tsx`

### FSD Layer-spezifische Konventionen

#### Slice-Namen (kebab-case)

features/
├── user-authentication/
├── product-catalog/
└── order-management/
entities/
├── user/
├── product/
└── order/

## TypeScript Konventionen

### Types über Interfaces

```typescript
// ✅ Types für Component Props
type UserProfileProps = {
  user: User;
  onEdit?: (user: User) => void;
  isEditable?: boolean;
};

// ✅ Union Types
type Status = 'loading' | 'success' | 'error';
type Theme = 'light' | 'dark';
Const über Functions
typescript// ✅ Const Arrow Functions bevorzugen
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return <div>{user.name}</div>;
};

// ✅ Für Event Handlers
const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  // ...
};
FSD-spezifische Anpassung
TSX-Hauptdatei direkt im Feature-Ordner
features/
└── user-authentication/
    ├── UserAuthentication.tsx    # ✅ Hauptkomponente direkt hier
    ├── index.ts                  # Public API
    ├── ui/
    │   ├── LoginForm.tsx
    │   └── SignupForm.tsx
    ├── model/
    │   ├── useAuth.ts
    │   └── authSlice.ts
    └── api/
        └── authApi.ts
Import Regeln
Cross-Import Hierarchie

app → kann nur shared verwenden
pages → kann widgets, features, entities, shared verwenden
widgets → kann features, entities, shared verwenden
features → kann entities, shared verwenden
entities → kann nur shared verwenden
shared → kann keine anderen Layer verwenden

Beispiele
Feature mit vollständiger FSD-Struktur
typescript// features/user-authentication/UserAuthentication.tsx
'use client';

import { useState } from 'react';
import { LoginForm } from './ui/LoginForm';
import { SignupForm } from './ui/SignupForm';
import { useAuth } from './model/useAuth';

type UserAuthenticationProps = {
  mode?: 'login' | 'signup';
  onSuccess?: () => void;
};

const UserAuthentication: React.FC<UserAuthenticationProps> = ({
  mode = 'login',
  onSuccess
}) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const { login, signup, loading } = useAuth();

  const handleModeSwitch = () => {
    setCurrentMode(currentMode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="user-authentication">
      {currentMode === 'login' ? (
        <LoginForm
          onSubmit={login}
          loading={loading}
          onSwitchMode={handleModeSwitch}
        />
      ) : (
        <SignupForm
          onSubmit={signup}
          loading={loading}
          onSwitchMode={handleModeSwitch}
        />
      )}
    </div>
  );
};

export { UserAuthentication };
Public API Export
typescript// features/user-authentication/index.ts
export { UserAuthentication } from './UserAuthentication';
export { useAuth } from './model/useAuth';
export { loginUser, signupUser, logoutUser } from './api/authApi';

// Types für externe Verwendung
export type { LoginCredentials, SignupCredentials } from './api/authApi';

```

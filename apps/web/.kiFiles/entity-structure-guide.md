## 1. Entity-Ordnerstruktur mit API-Endpoints (entity-structure-guide.md)

# Entity-Ordnerstruktur Guide für FSD mit API-Endpoints

## Grundprinzip

Jede Entity verwaltet ihre eigenen API-Endpoints direkt bei sich. Dies folgt dem
FSD-Prinzip der "Locality of Behavior" - alles was zusammengehört, liegt auch
zusammen.

## Ordnerstruktur

src/entities/{domain}/{entity-name}/ ├── api/ │ ├── endpoints.ts # Alle
API-Endpoints der Entity │ ├── queries.ts # TanStack Query Hooks (GET) │ ├──
mutations.ts # TanStack Mutations (POST/PUT/DELETE) │ └── index.ts # Re-exports
├── model/ │ ├── types.ts # TypeScript Types │ ├── schemas.ts # Zod Schemas für
Validierung │ ├── constants.ts # Konstanten (Enums, Config) │ └── index.ts #
Re-exports ├── ui/ │ ├── cards/ # Entity-spezifische Cards │ ├── cells/ # Table
Cells │ ├── badges/ # Status Badges │ └── index.ts # Re-exports ├── lib/ │ ├──
filters.ts # Filter-Logik │ ├── formatters.ts # Formatierungs-Helpers │ └──
index.ts # Re-exports └── index.ts # Public API der Entity

## Beispiel: Member Entity

### 1. Endpoints Definition

```typescript
// entities/intern/member/api/endpoints.ts
export const MEMBER_ENDPOINTS = {
  // Listen-Endpoints
  list: '/api/members',
  search: '/api/members/search',

  // Detail-Endpoints
  detail: (id: string) => `/api/members/${id}`,
  profile: (id: string) => `/api/members/${id}/profile`,

  // Aktionen
  create: '/api/members',
  createLocal: '/api/members/local',
  update: (id: string) => `/api/members/${id}`,
  delete: (id: string) => `/api/members/${id}`,

  // Sub-Ressourcen
  roles: (id: string) => `/api/members/${id}/roles`,
  permissions: (id: string) => `/api/members/${id}/permissions`,
  password: (id: string) => `/api/members/${id}/password`,

  // Spezielle Endpoints
  me: '/api/members/me',
  bulk: '/api/members/bulk',
} as const;
```

### 2. Queries (GET Requests)

```typescript
// entities/intern/member/api/queries.ts
import { createRemoteQuery } from '@/shared/api';
import { MEMBER_ENDPOINTS } from './endpoints';
import { memberListSchema, memberDetailSchema } from '../model/schemas';

export const useMemberList = createRemoteQuery({
  queryKey: (filters) => ['members', 'list', filters],
  endpoint: MEMBER_ENDPOINTS.list,
  schema: memberListSchema,
});

export const useMemberDetail = createRemoteQuery({
  queryKey: ({ id }) => ['members', 'detail', id],
  endpoint: ({ id }) => MEMBER_ENDPOINTS.detail(id),
  schema: memberDetailSchema,
});
```

### 3. Mutations (POST/PUT/DELETE)

```typescript
// entities/intern/member/api/mutations.ts
import { createRemoteMutation } from '@/shared/api';
import { MEMBER_ENDPOINTS } from './endpoints';

export const useCreateMember = createRemoteMutation({
  endpoint: MEMBER_ENDPOINTS.create,
  method: 'POST',
  invalidateQueries: ['members'],
});

export const useUpdateMember = createRemoteMutation({
  endpoint: ({ id }) => MEMBER_ENDPOINTS.update(id),
  method: 'PUT',
  invalidateQueries: ({ id }) => [
    ['members', 'list'],
    ['members', 'detail', id],
  ],
});
```

## Best Practices

### 1. Endpoint-Funktionen vs. Strings

- **Strings** für statische Endpoints: `/api/members`
- **Funktionen** für dynamische Endpoints: `(id) => \`/api/members/${id}\``

### 2. Gruppierung von Endpoints

```typescript
export const MEMBER_ENDPOINTS = {
  // Basis CRUD
  base: {
    list: '/api/members',
    detail: (id: string) => `/api/members/${id}`,
  },

  // Auth-bezogen
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
  },

  // Admin-Aktionen
  admin: {
    bulk: '/api/members/bulk',
    export: '/api/members/export',
  },
} as const;
```

### 3. Type-Safe Endpoints

```typescript
// Type für Endpoint-Parameter
type MemberEndpointParams = {
  id: string;
  roleId?: string;
};

// Typisierte Endpoint-Funktion
const endpoint = (params: MemberEndpointParams) =>
  `/api/members/${params.id}/roles/${params.roleId}`;
```

### 4. Versionierung

```typescript
const API_VERSION = 'v1';

export const MEMBER_ENDPOINTS = {
  list: `/api/${API_VERSION}/members`,
  // ...
};
```

## Integration mit Shared API

Die Entity importiert nur die benötigten Utilities aus Shared:

```typescript
import {
  createRemoteQuery,
  createRemoteMutation,
  queryClient
} from '@/shared/api';
```

## Vorteile dieser Struktur

1. **Keine Redundanz**: Endpoints werden nur einmal definiert
2. **Co-location**: Alles was zur Entity gehört ist an einem Ort
3. **Type Safety**: TypeScript kann Endpoint-Funktionen validieren
4. **Einfache Wartung**: Änderungen an Endpoints nur an einer Stelle
5. **Testbarkeit**: Endpoints können isoliert getestet werden
6. **Wiederverwendbarkeit**: Endpoints können in Queries und Mutations genutzt
   werden

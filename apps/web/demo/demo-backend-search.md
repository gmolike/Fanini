# DataTable mit Server-Side Features

## Übersicht

Die DataTable-Komponente wurde um vollständige Server-Side-Unterstützung
erweitert. Dies ermöglicht performante Darstellung großer Datenmengen durch
serverseitige Filterung, Sortierung und Pagination.

## Features

### 🚀 Server-Mode

- **Serverseitige Suche**: Mit konfigurierbarem Debouncing
- **Serverseitige Sortierung**: Nur eine Anfrage pro Sortierungsänderung
- **Serverseitige Pagination**: Lädt nur die benötigten Daten
- **Suchfeld-Anzeige**: Transparente Kommunikation über durchsuchte Felder

### 🔄 Hybrid-Unterstützung

- **Client-Mode**: Für kleine Datenmengen (Standard)
- **Server-Mode**: Für große Datenmengen und komplexe Queries
- **Nahtloser Wechsel**: Gleiche API für beide Modi

## Installation & Setup

### 1. Type-Definitionen

```typescript
// types.ts
import type { ServerSideConfig, ServerSideParams } from '@/shared/ui/dataTable';

// Server-Side Configuration
type ServerSideConfig = {
  enabled: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchableFields?: string[];
  debounceMs?: number;
};

// Parameter für Backend-Requests
type ServerSideParams = {
  search?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
};
```

### 2. Basis-Implementierung

```typescript
import { useState } from 'react';
import { DataTable, createTableDefinition } from '@/shared/ui/dataTable';
import { useQuery } from '@tanstack/react-query';

export const UserListServerSide = () => {
  // Server-Parameter State
  const [serverParams, setServerParams] = useState<ServerSideParams>({
    page: 0,
    limit: 20,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Backend-Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', serverParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Pagination (Backend erwartet meist 1-basiert)
      params.append('page', String(serverParams.page + 1));
      params.append('limit', String(serverParams.limit));

      // Sortierung
      if (serverParams.sortBy) {
        params.append('sortBy', serverParams.sortBy);
        params.append('sortOrder', serverParams.sortOrder || 'asc');
      }

      // Suche
      if (serverParams.search) {
        params.append('search', serverParams.search);
      }

      const response = await fetch(`/api/users?${params.toString()}`);
      return response.json();
    },
    keepPreviousData: true, // Smooth Transitions
  });

  // Table Definition
  const tableDefinition = createTableDefinition<User>({
    labels: {
      name: 'Name',
      email: 'E-Mail',
      role: 'Rolle',
      createdAt: 'Erstellt am',
      actions: 'Aktionen',
    },
    fields: [
      { id: 'name', sortable: true },
      { id: 'email', sortable: true },
      { id: 'role' },
      { id: 'createdAt', sortable: true },
      { id: 'actions' },
    ],
  });

  return (
    <DataTable
      tableDefinition={tableDefinition}
      data={data?.items ?? []}
      isLoading={isLoading}
      error={error}
      serverSide={{
        enabled: true,
        totalCount: data?.meta.total ?? 0,
        currentPage: serverParams.page,
        pageSize: serverParams.limit,
        searchableFields: ['name', 'email', 'department'],
        debounceMs: 500,
      }}
      onServerParamsChange={setServerParams}
      searchPlaceholder="Nutzer durchsuchen..."
      onEdit={(user) => console.log('Edit:', user)}
      onDelete={(user) => console.log('Delete:', user)}
    />
  );
};
```

## Backend Integration

### Expected Response Format

```typescript
type ApiResponse<T> = {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};
```

### Next.js API Route Beispiel

```typescript
// app/api/users/route.ts
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse Parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  // Build Query
  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { department: { contains: search, mode: 'insensitive' } },
    ],
  } : {};

  // Execute Queries
  const [items, total] = await Promise.all([
    db.users.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.users.count({ where }),
  ]);

  return Response.json({
    items,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
}
```

## Erweiterte Features

### Mit zusätzlichen Filtern

```typescript
export const AdvancedUserList = () => {
  const [filters, setFilters] = useState({
    search: '',
    role: null,
    isActive: true,
    department: null,
  });

  const [serverParams, setServerParams] = useState<ServerSideParams>({
    page: 0,
    limit: 20,
    search: filters.search,
    filters: {
      role: filters.role,
      isActive: filters.isActive,
      department: filters.department,
    },
  });

  // Query mit erweiterten Filtern
  const { data, isLoading } = useQuery({
    queryKey: ['users', serverParams],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Basis-Parameter
      params.append('page', String(serverParams.page + 1));
      params.append('limit', String(serverParams.limit));

      // Erweiterte Filter
      if (serverParams.filters?.role) {
        params.append('role', serverParams.filters.role);
      }
      if (serverParams.filters?.isActive !== undefined) {
        params.append('isActive', String(serverParams.filters.isActive));
      }

      const response = await fetch(`/api/users?${params.toString()}`);
      return response.json();
    },
  });

  return (
    <>
      {/* Filter UI */}
      <div className="mb-4 flex gap-4">
        <Select
          value={filters.role}
          onValueChange={(value) => {
            setFilters(prev => ({ ...prev, role: value }));
            setServerParams(prev => ({
              ...prev,
              page: 0,
              filters: { ...prev.filters, role: value },
            }));
          }}
        >
          {/* Role options */}
        </Select>

        {/* Weitere Filter... */}
      </div>

      <DataTable
        tableDefinition={userTableDefinition}
        data={data?.items ?? []}
        isLoading={isLoading}
        serverSide={{
          enabled: true,
          totalCount: data?.meta.total ?? 0,
          currentPage: serverParams.page,
          pageSize: serverParams.limit,
          searchableFields: ['name', 'email'],
        }}
        onServerParamsChange={(newParams) => {
          setServerParams(newParams);
          setFilters(prev => ({ ...prev, search: newParams.search || '' }));
        }}
      />
    </>
  );
};
```

### Performance-Optimierung

```typescript
// Mit React Query für optimale Caching-Strategie
const { data, isLoading, isFetching } = useQuery({
  queryKey: ['users', serverParams],
  queryFn: fetchUsers,
  keepPreviousData: true, // Zeigt alte Daten während neue geladen werden
  staleTime: 5 * 60 * 1000, // 5 Minuten
  cacheTime: 10 * 60 * 1000, // 10 Minuten
});

// Loading-States differenzieren
<DataTable
  isLoading={isLoading} // Initialer Load
  isFetching={isFetching} // Nachfolgende Loads
  // ...
/>
```

## Migration von Client zu Server Mode

### Vorher (Client-Mode)

```typescript
const { data: allUsers } = useGetAllUsers();

<DataTable
  tableDefinition={tableDefinition}
  data={allUsers ?? []}
  pageSize={20}
/>
```

### Nachher (Server-Mode)

```typescript
const [serverParams, setServerParams] = useState<ServerSideParams>({
  page: 0,
  limit: 20,
});

const { data } = useGetUsersPaginated(serverParams);

<DataTable
  tableDefinition={tableDefinition}
  data={data?.items ?? []}
  serverSide={{
    enabled: true,
    totalCount: data?.meta.total ?? 0,
    currentPage: serverParams.page,
    pageSize: serverParams.limit,
    searchableFields: ['name', 'email'],
  }}
  onServerParamsChange={setServerParams}
/>
```

## Best Practices

### 1. Wann Server-Mode verwenden?

- ✅ Bei mehr als 500 Datensätzen
- ✅ Bei komplexen Datenstrukturen
- ✅ Wenn Echtzeit-Daten wichtig sind
- ❌ Bei statischen, kleinen Datenmengen
- ❌ Wenn Offline-Funktionalität benötigt wird

### 2. Debouncing-Strategien

```typescript
serverSide={{
  // Schnelle Typer: Längeres Debouncing
  debounceMs: 500,

  // Langsame Datenbank: Noch längeres Debouncing
  debounceMs: 800,

  // Autocomplete-ähnlich: Kurzes Debouncing
  debounceMs: 300,
}}
```

### 3. Error Handling

```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['users', serverParams],
  queryFn: fetchUsers,
  retry: 3,
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
});

<DataTable
  // ...
  error={error}
  onRetry={() => refetch()}
/>
```

## Troubleshooting

### Problem: Pagination springt beim Sortieren

**Lösung**: Setze page auf 0 bei Sortierungsänderung

```typescript
onServerParamsChange={(params) => {
  if (params.sortBy !== serverParams.sortBy) {
    setServerParams({ ...params, page: 0 });
  } else {
    setServerParams(params);
  }
}}
```

### Problem: Zu viele API-Requests

**Lösung**: Debouncing erhöhen oder keepPreviousData nutzen

```typescript
serverSide={{
  debounceMs: 800, // Erhöhen
}}
```

### Problem: Flackern beim Seitenwechsel

**Lösung**: keepPreviousData in React Query

```typescript
useQuery({
  // ...
  keepPreviousData: true,
})
```

## TypeScript Support

Die DataTable bietet vollständige TypeScript-Unterstützung:

```typescript
// Typsichere Table Definition
const tableDefinition = createTableDefinition<User>({
  labels: {
    id: 'ID', // TypeScript erzwingt alle User-Keys
    name: 'Name',
    // ...
  },
  fields: [
    { id: 'name' }, // Autocomplete für User-Keys
    // ...
  ],
});

// Typsichere Callbacks
onEdit={(user) => {
  // user ist vollständig typisiert als User
  console.log(user.id, user.name);
}}
```

## Zusammenfassung

Die Server-Mode-Erweiterung macht die DataTable zu einer vielseitigen Lösung für
alle Tabellenanforderungen - von kleinen Client-seitigen Listen bis zu großen,
serverbasierten Datenmengen. Die konsistente API ermöglicht einfache Migration
und Wartung.

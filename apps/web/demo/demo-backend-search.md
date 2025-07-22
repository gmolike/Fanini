# DataTable mit Backend-Suche

Dieses Beispiel zeigt, wie die DataTable-Komponente mit Backend-basierter Suche
verwendet wird.

## Basis-Implementation

\`\`\`typescript import { useState } from 'react'; import { DataTable,
createTableDefinition } from '@/shared/ui/dataTable'; import { useQuery } from
'@tanstack/react-query';

// Datentyp definieren type Product = { id: string; name: string; description:
string; category: string; price: number; stock: number; };

// Table Definition const productTableDefinition =
createTableDefinition<Product>({ labels: { name: 'Produktname', description:
'Beschreibung', category: 'Kategorie', price: 'Preis', stock: 'Lagerbestand',
actions: 'Aktionen', }, fields: [ { id: 'name', sortable: true }, { id:
'description' }, { id: 'category', filterable: true }, { id: 'price', sortable:
true }, { id: 'stock', sortable: true }, { id: 'actions' }, ], });

// Component export const ProductTable = () => { const [searchTerm,
setSearchTerm] = useState('');

// Backend Query mit Such-Parameter const { data, isLoading, error } =
useQuery({ queryKey: ['products', searchTerm], queryFn: async () => { const
params = new URLSearchParams(); if (searchTerm) { params.append('search',
searchTerm); }

      const response = await fetch(\`/api/products?\${params.toString()}\`);
      return response.json();
    },
    // Verhindere zu viele Requests
    keepPreviousData: true,

});

// Backend Search Configuration const backendSearchConfig = { enabled: true,
searchableFields: ['name', 'description', 'category'], debounceMs: 500, };

return ( <DataTable tableDefinition={productTableDefinition} data={data?.items
?? []} isLoading={isLoading} error={error} backendSearch={backendSearchConfig}
onBackendSearch={setSearchTerm} searchPlaceholder="Produkte suchen..."
onEdit={(product) => console.log('Edit:', product)} onDelete={(product) =>
console.log('Delete:', product)} /> ); }; \`\`\`

## Erweiterte Konfiguration

### Mit benutzerdefinierten Suchfeldern

\`\`\`typescript const backendSearchConfig = { enabled: true, searchableFields:
['name', 'email', 'company.name', 'address.city'], debounceMs: 300, endpoint:
'/api/custom-search', // Optional: Custom Endpoint }; \`\`\`

### Integration mit bestehenden Filtern

\`\`\`typescript export const AdvancedProductTable = () => { const [filters,
setFilters] = useState({ search: '', category: null, minPrice: null, maxPrice:
null, });

const { data, isLoading } = useQuery({ queryKey: ['products', filters], queryFn:
async () => { const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

      const response = await fetch(\`/api/products?\${params.toString()}\`);
      return response.json();
    },

});

return ( <> {/_ Zusätzliche Filter UI _/} <div className="mb-4 flex gap-2">
<Select value={filters.category} onValueChange={(value) => setFilters(prev => ({
...prev, category: value }))} > {/_ Select Options _/} </Select> </div>

      <DataTable
        tableDefinition={productTableDefinition}
        data={data?.items ?? []}
        isLoading={isLoading}
        backendSearch={{
          enabled: true,
          searchableFields: ['name', 'description'],
        }}
        onBackendSearch={(search) => setFilters(prev => ({ ...prev, search }))}
      />
    </>

); }; \`\`\`

// demo-complete-server-integration.md

## Vollständige Server-Side DataTable Integration

export const ProductListPage = () => { const [serverParams, setServerParams] =
useState<ServerSideParams>({ page: 0, limit: 20, search: '', sortBy:
'createdAt', sortOrder: 'desc', });

const { data, isLoading, error } = useQuery({ queryKey: ['products',
serverParams], queryFn: async () => { const params = new URLSearchParams();

      // Pagination (Backend erwartet 1-basiert)
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

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products');

      return response.json();
    },
    keepPreviousData: true, // Smooth page transitions

});

return ( <DataTable tableDefinition={productTableDefinition} data={data?.items
?? []} isLoading={isLoading} error={error} serverSide={{
        enabled: true,
        totalCount: data?.meta.total ?? 0,
        currentPage: serverParams.page,
        pageSize: serverParams.limit,
        searchableFields: ['name', 'description', 'sku', 'category'],
        debounceMs: 500,
      }} onServerParamsChange={setServerParams} searchPlaceholder="Produkte
durchsuchen..." onEdit={(product) => navigate(`/products/${product.id}/edit`)}
onDelete={(product) => openDeleteDialog(product)} onAdd={() =>
navigate('/products/new')} addButtonText="Neues Produkt" /> ); };

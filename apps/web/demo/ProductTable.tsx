// src/features/test/product-list/ui/ProductTable.tsx
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable } from '@/shared/ui/dataTable';

import { useProductList } from '@/entities/test/product';

import { useUrlState } from '@/shared/hooks/useUrlState';

import { getProductTableDefinition } from '../lib/tableDefinition';

import type { ServerSideParams } from '@/shared/ui/dataTable';

/**
 * ProductTable Component
 * @description Server-Side DataTable mit GlobalFilterResponse
 */
export const ProductTable = () => {
  const navigate = useNavigate();

  // URL State Management (0-basiert wie das Backend)
  const [urlState, setUrlState] = useUrlState({
    page: 0,
    limit: 20,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as const,
  });

  // Query mit URL State - keine Konvertierung nötig!
  const { data, isLoading, error, isFetching } = useProductList(urlState);

  // Handle params change
  const handleServerParamsChange = useCallback(
    (params: ServerSideParams) => {
      setUrlState({
        page: params.page,
        limit: params.limit,
        search: params.search || '',
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
      });
    },
    [setUrlState]
  );

  const tableDefinition = getProductTableDefinition();

  // Berechne die Gesamtseiten für die DataTable
  const totalPages = data ? Math.ceil(data.totalNumber / data.limit) : 0;

  return (
    <div className="relative">
      {/* Subtle loading indicator */}
      {isFetching && !isLoading && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
        </div>
      )}

      <DataTable
        tableDefinition={tableDefinition}
        data={data?.result ?? []}
        isLoading={isLoading}
        error={error}
        serverSide={{
          enabled: true,
          totalCount: data?.totalNumber ?? 0,
          currentPage: data?.page ?? urlState.page,
          pageSize: data?.limit ?? urlState.limit,
          searchableFields: ['name', 'description', 'sku', 'category'],
          debounceMs: 500,
        }}
        onServerParamsChange={handleServerParamsChange}
        searchPlaceholder="Produkte durchsuchen..."
        onEdit={product => navigate(`/test/products/${product.id}/edit`)}
        onDelete={product => console.log('Delete product:', product)}
        onAdd={() => navigate('/test/products/new')}
        addButtonText="Neues Produkt"
        stickyHeader
        stickyActionColumn
      />
    </div>
  );
};

// src/features/test/product-list/ui/ProductTable.tsx
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable } from '@/shared/ui/dataTable';
import { useUrlState } from '@/shared/hooks/useUrlState';

import { useProductList } from '@/entities/test/product';

import { getProductTableDefinition } from '../lib/tableDefinition';

import type { ServerSideParams } from '@/shared/ui/dataTable';

/**
 * ProductTable Component
 * @description Server-Side DataTable mit angepasstem Backend-Format
 */
export const ProductTable = () => {
  const navigate = useNavigate();

  // URL State Management
  const [urlState, setUrlState] = useUrlState({
    page: 0,
    pageSize: 20,
    searchTerm: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as const,
  });

  // Query mit angepassten Parametern
  const { data, isLoading, error, isFetching } = useProductList({
    page: urlState.page,
    pageSize: urlState.pageSize,
    searchTerm: urlState.searchTerm,
    sortBy: urlState.sortBy,
    sortOrder: urlState.sortOrder,
  });

  // Handle params change von DataTable
  const handleServerParamsChange = useCallback(
    (params: ServerSideParams) => {
      setUrlState({
        page: params.page,
        pageSize: params.limit, // DataTable nutzt "limit", Backend "pageSize"
        searchTerm: params.search || '',
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
      });
    },
    [setUrlState]
  );

  const tableDefinition = getProductTableDefinition();

  return (
    <div className="relative">
      {/* Loading indicator */}
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
          totalCount: data?.totalElements ?? 0,
          currentPage: data?.page ?? 0,
          pageSize: data?.pageSize ?? 20,
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

// src/features/test/product-list/ui/ProductTableWithUrl.tsx
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable } from '@/shared/ui/dataTable';
import { useUrlState } from '@/shared/hooks/useUrlState';

import { useProductList } from '@/entities/test/product';

import { getProductTableDefinition } from '../lib/tableDefinition';

import type { ServerSideParams } from '@/shared/ui/dataTable';

/**
 * ProductTableWithUrl Component
 * @description Server-Side DataTable mit URL State Management
 */
export const ProductTableWithUrl = () => {
  const navigate = useNavigate();

  // URL State als Single Source of Truth
  const [urlState, setUrlState] = useUrlState({
    page: 0,
    pageSize: 20,
    searchTerm: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as const,
  });

  // Query mit URL State
  const { data, isLoading, error, isFetching } = useProductList(urlState);

  // Handle params change
  const handleServerParamsChange = useCallback(
    (params: ServerSideParams) => {
      setUrlState({
        page: params.page,
        pageSize: params.limit,
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
          currentPage: urlState.page, // URL State als Source of Truth
          pageSize: urlState.pageSize,
          searchableFields: ['name', 'description', 'sku', 'category'],
          debounceMs: 500,
        }}
        onServerParamsChange={handleServerParamsChange}
        searchPlaceholder="Produkte durchsuchen..."
        onEdit={product => navigate(`/test/products/${product.id}/edit`)}
        onDelete={product => console.log('Delete product:', product)}
        onAdd={() => navigate('/test/products/new')}
        addButtonText="Neues Produkt"
      />
    </div>
  );
};

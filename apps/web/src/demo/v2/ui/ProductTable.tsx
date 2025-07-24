// src/features/test/product-list/ui/ProductTable.tsx
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/shadcn';
import { DataTable } from '@/shared/ui/dataTable';
import { useTypedUrlState } from '@/shared/hooks/useTypedUrlState';

import { useProductList } from '@/entities/test/product';

import { getProductTableDefinition } from '../lib/tableDefinition';

import type { ServerSideParams } from '@/shared/ui/dataTable';

/**
 * Default Filter Values
 * @description Standard-Werte für die Filter
 */
const DEFAULT_FILTERS = {
  page: 0,
  pageSize: 20,
  searchTerm: '',
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
} as const;

/**
 * ProductTable Component
 * @description Server-Side DataTable mit URL State Management
 */
export const ProductTable = () => {
  const navigate = useNavigate();

  // URL State Management
  const [urlState, setUrlState, resetUrlState] = useTypedUrlState(DEFAULT_FILTERS);

  // Query mit URL State
  const { data, isLoading, error, isFetching } = useProductList(urlState);

  // Handle DataTable parameter changes
  const handleServerParamsChange = useCallback(
    (params: ServerSideParams) => {
      setUrlState({
        page: params.page,
        pageSize: params.limit,
        searchTerm: params.search || '',
        sortBy: params.sortBy || DEFAULT_FILTERS.sortBy,
        sortOrder: params.sortOrder || DEFAULT_FILTERS.sortOrder,
      });
    },
    [setUrlState]
  );

  // Reset filters
  const handleResetFilters = useCallback(() => {
    resetUrlState();
  }, [resetUrlState]);

  // Table Definition
  const tableDefinition = getProductTableDefinition();

  // Check if filters are active
  const hasActiveFilters =
    urlState.searchTerm !== '' ||
    urlState.sortBy !== DEFAULT_FILTERS.sortBy ||
    urlState.sortOrder !== DEFAULT_FILTERS.sortOrder ||
    urlState.page !== 0;

  return (
    <div className="space-y-4">
      {/* Filter Status Bar */}
      {hasActiveFilters && (
        <div className="bg-muted/50 flex items-center justify-between rounded-lg px-4 py-2">
          <span className="text-muted-foreground text-sm">Filter aktiv</span>
          <Button variant="ghost" size="sm" onClick={handleResetFilters}>
            Filter zurücksetzen
          </Button>
        </div>
      )}

      {/* Table Container */}
      <div className="relative">
        {/* Loading Overlay */}
        {isFetching && !isLoading && (
          <div className="bg-background/50 pointer-events-none absolute inset-0 z-10">
            <div className="absolute top-2 right-2">
              <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
            </div>
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
            currentPage: urlState.page,
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
          stickyHeader
          stickyActionColumn
        />
      </div>
    </div>
  );
};

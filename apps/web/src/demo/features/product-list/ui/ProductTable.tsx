// apps/web/src/demo/features/product-list/ui/ProductTable.tsx
// Final location: apps/web/src/features/product-list/ui/ProductTable.tsx

import { useCallback, useEffect } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { Card } from '@/shared/shadcn';
import { DataTable } from '@/shared/ui/dataTable';
import type { ServerSideParams } from '@/shared/ui/dataTable/model/types';

import { useProductList } from '../../../entities/product/api/queries';
import { useFilterUrlState } from '../../../shared/hooks/useFilterUrlState';
import { productTableDefinition } from '../model/tableDefinition';

import type { Product } from '../../../entities/product/model/types';
import type { DataTableFilterState } from '../../../shared/api/types/filter';

/**
 * ProductTable Component
 * @description Server-seitige Produkttabelle mit URL-State
 */
export const ProductTable = () => {
  const navigate = useNavigate();

  // URL State Management mit TanStack Router
  const [filterState, setFilterState] = useFilterUrlState({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Data Query - verwende filterState direkt
  const { data, isLoading, error, isFetching } = useProductList(filterState);

  // Handle DataTable parameter changes
  const handleServerParamsChange = useCallback(
    (params: ServerSideParams) => {
      // Update only changed values to preserve sort
      const updates: Partial<DataTableFilterState> = {
        page: params.page,
        pageSize: params.limit,
      };

      // Only update search if it changed
      if (params.search !== filterState.searchTerm) {
        updates.searchTerm = params.search ?? '';
      }

      // Only update sort if it explicitly changed
      if (params.sortBy !== undefined && params.sortOrder !== undefined) {
        updates.sortBy = params.sortBy;
        updates.sortOrder = params.sortOrder;
      }

      setFilterState(updates);
    },
    [setFilterState, filterState.searchTerm]
  );

  // Actions
  const handleEdit = useCallback(
    (product: Product) => {
      navigate({
        to: '/products/$productId/edit',
        params: { productId: product.id },
      });
    },
    [navigate]
  );

  const handleDelete = useCallback((product: Product) => {
    console.log('Delete product:', product.id);
  }, []);

  const handleAdd = useCallback(() => {
    navigate({ to: '/products/new' });
  }, [navigate]);

  return (
    <Card className="relative">
      {/* Loading Indicator */}
      {isFetching ? (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
        </div>
      ) : null}

      <DataTable
        tableDefinition={productTableDefinition}
        data={data?.result ?? []}
        isLoading={isLoading}
        error={error}
        serverSide={{
          enabled: true,
          totalCount: data?.totalElements ?? 0,
          currentPage: filterState.page,
          pageSize: filterState.pageSize,
          searchableFields: ['name', 'description', 'sku', 'category'],
          debounceMs: 500,
        }}
        onServerParamsChange={handleServerParamsChange}
        searchPlaceholder="Produkte durchsuchen..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        addButtonText="Neues Produkt"
        stickyHeader
        maxHeight="600px"
        initialGlobalFilter={filterState.searchTerm}
        initialSorting={
          filterState.sortBy
            ? [{ id: filterState.sortBy, desc: filterState.sortOrder === 'desc' }]
            : undefined
        }
      />
    </Card>
  );
};

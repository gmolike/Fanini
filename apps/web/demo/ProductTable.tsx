// src/features/test/product-list/ui/ProductTable.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable } from '@/shared/ui/dataTable';

import { useProductList } from '@/entities/test/product';

import { getProductTableDefinition } from '../lib/tableDefinition';

import type { ServerSideParams } from '@/shared/ui/dataTable';

/**
 * ProductTable Component
 * @description Server-Side DataTable für Product-Liste
 */
export const ProductTable = () => {
  const navigate = useNavigate();

  // Server Parameters State
  const [serverParams, setServerParams] = useState<ServerSideParams>({
    page: 0,
    limit: 20,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Query mit RemoteQuery Hook
  const { data, isLoading, error } = useProductList({
    search: serverParams.search,
    page: serverParams.page + 1, // Backend erwartet 1-basiert
    limit: serverParams.limit,
    sortBy: serverParams.sortBy,
    sortOrder: serverParams.sortOrder,
  });

  // Table Definition
  const tableDefinition = getProductTableDefinition();

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
        searchableFields: ['name', 'description', 'sku', 'category'],
        debounceMs: 500,
      }}
      onServerParamsChange={setServerParams}
      searchPlaceholder="Produkte durchsuchen..."
      onEdit={product => navigate(`/test/products/${product.id}/edit`)}
      onDelete={product => console.log('Delete product:', product)}
      onAdd={() => navigate('/test/products/new')}
      addButtonText="Neues Produkt"
      stickyHeader
      stickyActionColumn
    />
  );
};

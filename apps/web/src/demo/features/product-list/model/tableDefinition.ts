// apps/web/src/demo/features/product-list/model/tableDefinition.ts
// Final location: apps/web/src/features/product-list/model/tableDefinition.ts

import { BooleanCell, createTableDefinition, DateCell, TextCell } from '@/shared/ui/dataTable';

import type { Product } from '../../../entities/product/model/types';

/**
 * Product Table Definition
 * @description Tabellen-Konfiguration für Produkte
 */
export const productTableDefinition = createTableDefinition<Product>({
  labels: {
    name: 'Produktname',
    description: 'Beschreibung',
    price: 'Preis',
    category: 'Kategorie',
    sku: 'Artikelnummer',
    inStock: 'Verfügbar',
    createdAt: 'Erstellt am',
    actions: 'Aktionen',
    id: '',
    updatedAt: '',
  },
  fields: [
    { id: 'name', sortable: true, searchable: true },
    { id: 'description', cell: TextCell },
    {
      id: 'price',
      sortable: true,
      accessor: row => `€ ${row.price.toFixed(2)}`,
    },
    { id: 'category', sortable: true, filterable: true },
    { id: 'sku', searchable: true },
    { id: 'inStock', cell: BooleanCell },
    { id: 'createdAt', cell: DateCell, sortable: true },
    { id: 'actions' },
  ],
});

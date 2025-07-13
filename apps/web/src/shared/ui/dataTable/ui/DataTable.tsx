/**
 * @module dataTable/DataTable
 * @description Hauptkomponente für Tabellen-Darstellung
 */

import { useRef } from 'react';

import { flexRender } from '@tanstack/react-table';

import { cn } from '@/shared/lib';
import {
  Card,
  CardContent,
  ShadCnTable,
  ShadCnTableBody,
  ShadCnTableCell,
  ShadCnTableHead,
  ShadCnTableHeader,
  ShadCnTableRow,
} from '@/shared/shadcn';

import { useDataTable } from '../model/hooks';

import { EmptyState, ErrorState, ExpandButton, Pagination, Skeleton, Toolbar } from './parts';

import type { DataTableProps, TableDataConstraint } from '../model/types';

/**
 * DataTable Component
 *
 * @description Hauptkomponente für die Tabellendarstellung. Bietet umfangreiche Features
 * wie Sortierung, Filterung, Pagination, expandierbare Zeilen und mehr. Arbeitet mit
 * typsicheren TableDefinitions für optimale Developer Experience.
 *
 * @template TData - Datentyp der Tabellenzeilen
 * @template TTableDef - Typ der TableDefinition
 *
 * @param props - DataTable Properties
 * @returns Rendered DataTable
 *
 * @example
 * ```tsx
 * // Definition erstellen
 * const userTableDef = createTableDefinition<User>({
 *   labels: {
 *     name: 'Name',
 *     email: 'E-Mail',
 *     role: 'Rolle',
 *     actions: 'Aktionen'
 *   },
 *   fields: [
 *     { id: 'name', sortable: true, searchable: true },
 *     { id: 'email', cell: EmailCell },
 *     { id: 'role', cell: RoleBadge },
 *     { id: 'actions', cell: 'actions' }
 *   ]
 * });
 *
 * // Tabelle verwenden
 * <DataTable
 *   tableDefinition={userTableDef}
 *   data={users}
 *   isLoading={isLoading}
 *   error={error}
 *   onRowClick={(user) => navigate(`/users/${user.id}`)}
 *   onEdit={(user) => openEditDialog(user)}
 *   onDelete={(user) => confirmDelete(user)}
 *   expandable
 *   initialRowCount={5}
 * />
 * ```
 */
export const DataTable = <TData extends TableDataConstraint = TableDataConstraint>(
  props: DataTableProps<TData>
) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const controller = useDataTable(props);

  // Early returns für spezielle States
  if (controller.isLoading) {
    return (
      <div className={cn('space-y-4', props.className)}>
        <Skeleton {...controller.skeletonProps} />
      </div>
    );
  }

  if (controller.error) {
    const ErrorComponent = props.errorStateComponent ?? ErrorState;
    return (
      <div className={cn('space-y-4', props.className)}>
        <Card>
          <CardContent className="py-8">
            <ErrorComponent {...controller.errorProps} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (controller.isEmpty) {
    const EmptyComponent = props.emptyStateComponent ?? EmptyState;
    return (
      <div className={cn('space-y-4', props.className)}>
        <Card>
          <CardContent className="py-12">
            <EmptyComponent />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Normale Tabellen-Darstellung
  return (
    <div className={cn('space-y-4', props.className)}>
      <Toolbar {...controller.toolbarProps} />

      <div
        ref={tableRef}
        className={cn(
          'overflow-auto rounded-md border',
          controller.coreTableProps.stickyHeader && 'relative',
          controller.tableProps.className
        )}
        style={controller.tableProps.style}
      >
        <ShadCnTable>
          <ShadCnTableHeader
            className={controller.coreTableProps.stickyHeader ? 'bg-muted sticky top-0 z-10' : ''}
          >
            {controller.table.getHeaderGroups().map(headerGroup => (
              <ShadCnTableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const isActionColumn = header.column.id === 'actions';
                  return (
                    <ShadCnTableHead
                      key={header.id}
                      className={cn(
                        isActionColumn &&
                          controller.coreTableProps.stickyActionColumn &&
                          'bg-muted sticky right-0 shadow-sm'
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </ShadCnTableHead>
                  );
                })}
              </ShadCnTableRow>
            ))}
          </ShadCnTableHeader>

          <ShadCnTableBody>
            {controller.displayRows.length > 0 ? (
              controller.displayRows.map(row => {
                const rowId = String(row.original[props.idKey ?? 'id'] ?? row.id);
                const isSelected = props.selectedId == row.original[props.idKey ?? 'id'];

                return (
                  <ShadCnTableRow
                    key={row.id}
                    data-row-id={rowId}
                    onClick={() => props.onRowClick?.(row.original)}
                    className={cn(
                      props.onRowClick && 'hover:bg-muted/50 cursor-pointer',
                      isSelected && 'bg-muted/50'
                    )}
                  >
                    {row.getVisibleCells().map(cell => {
                      const isActionColumn = cell.column.id === 'actions';
                      return (
                        <ShadCnTableCell
                          key={cell.id}
                          className={cn(
                            isActionColumn &&
                              controller.coreTableProps.stickyActionColumn &&
                              'bg-background sticky right-0 shadow-sm'
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </ShadCnTableCell>
                      );
                    })}
                  </ShadCnTableRow>
                );
              })
            ) : (
              <ShadCnTableRow>
                <ShadCnTableCell
                  colSpan={controller.table.getAllColumns().length}
                  className="text-muted-foreground h-24 text-center"
                >
                  Keine Ergebnisse gefunden.
                </ShadCnTableCell>
              </ShadCnTableRow>
            )}
          </ShadCnTableBody>
        </ShadCnTable>
      </div>

      {controller.showPagination ? <Pagination {...controller.paginationProps} /> : null}
      {controller.showExpandButton ? <ExpandButton {...controller.expandProps} /> : null}
    </div>
  );
};

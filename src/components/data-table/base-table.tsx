import { useEffect, useState, type ReactNode } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type Table as TanStackTable,
  type VisibilityState,
} from '@tanstack/react-table';

import { cn } from '#/lib/utils';
import {
  useTableUrlState,
  type NavigateFn,
} from '#/hooks/use-table-url-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import { Skeleton } from '#/components/ui/skeleton';
import { DataTableToolbar } from './toolbar';
import { DataTablePagination } from './pagination';
import { DataTableViewOptions } from './view-options';

export interface ToolbarConfig<TData = unknown> {
  searchPlaceholder?: string;
  searchKey?: string;
  filters?: Array<{
    columnId: string;
    title: string;
    options: Array<{
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }>;
  }>;
  extra?: ReactNode | ((table: TanStackTable<TData>) => ReactNode);
  debounceDelay?: number;
}

export interface TableConfig {
  pagination?: {
    pageKey?: string;
    pageSizeKey?: string;
    defaultPage?: number;
    defaultPageSize?: number;
  };
  globalFilter?: {
    enabled?: boolean;
    key?: string;
    trim?: boolean;
  };
  columnFilters?: Array<
    | {
        columnId: string;
        searchKey: string;
        type?: 'string';
        serialize?: (value: unknown) => unknown;
        deserialize?: (value: unknown) => unknown;
      }
    | {
        columnId: string;
        searchKey: string;
        type: 'array';
        serialize?: (value: unknown) => unknown;
        deserialize?: (value: unknown) => unknown;
      }
  >;
}

export interface BaseTableProps<TData> {
  data: TData[];
  total?: number;
  columns: ColumnDef<TData, unknown>[];
  /** Route search params (TanStack Router `useSearch` output). */
  search?: Record<string, unknown>;
  /** Route navigate function for URL state sync. */
  navigate?: NavigateFn;
  tableConfig?: TableConfig;
  toolbar?: ToolbarConfig<TData>;
  hideToolbar?: boolean;
  enableRowSelection?: boolean;
  manualPagination?: boolean;
  manualFiltering?: boolean;
  rowKey?: keyof TData | ((record: TData) => string | number);
  /** Optional content above the toolbar (page title, KPI cards, etc.). */
  header?: ReactNode;
  renderBeforeTable?: ReactNode;
  renderAfterTable?: (table: TanStackTable<TData>) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
  containerClassName?: string;
  tableId?: string;
  isLoading?: boolean;
  /** Row-level action cell — renders at the end of every row (not a column). */
  rowActions?: (record: TData) => ReactNode;
}

const NOOP_NAVIGATE: NavigateFn = () => {};

/**
 * BaseTable — the canonical list table for the partner portal.
 *
 * Builds on TanStack Table v8 + URL state hook. Pages compose it like:
 *
 * ```tsx
 * <BaseTable<Referral>
 *   data={items}
 *   total={total}
 *   columns={columns}
 *   isLoading={isLoading}
 *   header={<DataTableHeader title="Referrals" />}
 *   toolbar={{
 *     searchKey: 'email',
 *     searchPlaceholder: 'Search by email',
 *     filters: [{ columnId: 'status', title: 'Status', options: STATUS_OPTIONS }],
 *   }}
 * />
 * ```
 */
export function BaseTable<TData extends object>({
  data,
  total,
  columns,
  search,
  navigate,
  tableConfig = {},
  toolbar,
  hideToolbar = false,
  enableRowSelection = false,
  manualPagination = false,
  manualFiltering = false,
  rowKey = 'id' as keyof TData,
  header,
  renderBeforeTable,
  renderAfterTable,
  emptyState,
  className,
  containerClassName,
  tableId,
  isLoading = false,
  rowActions,
}: BaseTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
    globalFilter,
    onGlobalFilterChange,
  } = useTableUrlState({
    search: search ?? {},
    navigate: navigate ?? NOOP_NAVIGATE,
    ...tableConfig,
  });

  const pageCount =
    total && pagination.pageSize ? Math.ceil(total / pagination.pageSize) : -1;

  const tableColumns: ColumnDef<TData, unknown>[] = [
    ...columns,
    ...(rowActions
      ? [
          {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
              <div className="flex items-center justify-end gap-1">
                {rowActions(row.original)}
              </div>
            ),
            enableSorting: false,
            enableHiding: false,
            meta: { className: 'w-px' },
          } as ColumnDef<TData, unknown>,
        ]
      : []),
  ];

  const table = useReactTable<TData>({
    data,
    columns: tableColumns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
      ...(globalFilter !== undefined && { globalFilter }),
    },
    enableRowSelection,
    manualPagination,
    manualFiltering,
    pageCount,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    ...(onGlobalFilterChange && { onGlobalFilterChange }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    ...(manualPagination
      ? {}
      : { getPaginationRowModel: getPaginationRowModel() }),
    ...(manualFiltering ? {} : { getFilteredRowModel: getFilteredRowModel() }),
    getRowId: (row) =>
      typeof rowKey === 'function' ? String(rowKey(row)) : String(row[rowKey] ?? ''),
  });

  useEffect(() => {
    if (pageCount > 0) ensurePageInRange(pageCount);
  }, [pageCount, ensurePageInRange]);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {header}

      {!hideToolbar && toolbar && (
        <div className="flex items-center justify-between gap-4">
          <DataTableToolbar
            table={table}
            searchPlaceholder={toolbar.searchPlaceholder}
            searchKey={toolbar.searchKey}
            filters={toolbar.filters}
            debounceDelay={toolbar.debounceDelay}
          />
          <div className="flex items-center gap-2">
            {typeof toolbar.extra === 'function'
              ? toolbar.extra(table)
              : toolbar.extra}
            <DataTableViewOptions table={table} />
          </div>
        </div>
      )}

      {renderBeforeTable}

      <div
        className={cn(
          'overflow-hidden rounded-xl border border-border bg-card',
          containerClassName,
        )}
      >
        <div className="overflow-x-auto">
          <Table id={tableId}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'h-10 bg-muted/40 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground',
                        (header.column.columnDef.meta as { className?: string })
                          ?.className,
                      )}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    {tableColumns.map((_, j) => (
                      <TableCell key={`sk-${i}-${j}`} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    className="transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'h-12 px-4 align-middle',
                          (
                            cell.column.columnDef.meta as { className?: string }
                          )?.className,
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {emptyState ?? 'No data available.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {(total !== undefined || !manualPagination) && (
          <DataTablePagination
            table={table}
            total={total ?? table.getFilteredRowModel().rows.length}
          />
        )}
      </div>

      {renderAfterTable && renderAfterTable(table)}
    </div>
  );
}

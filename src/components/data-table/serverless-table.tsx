import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';

import { cn } from '#/lib/utils';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { useState, type ReactNode } from 'react';
import { Skeleton } from '../ui/skeleton';
import { ServerlessPagination } from './serverless-pagination';
import type { NavigateFn } from '#/hooks/use-table-url-state';
import { EmptyContent } from '../common';

export type DataTableProps<TData> = Readonly<{
  data: TData[];
  columns: ColumnDef<TData>[];
  rowKey?: keyof TData | ((record: TData) => string | number);
  rowActions?: (record: TData) => ReactNode;
  isLoading?: boolean;
  emptyState?: ReactNode;
  hasNextPage?: boolean;
  hidePagination?: boolean;
  currentPage?: number;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  search?: Record<string, unknown>;
  navigate?: NavigateFn;
  tableId?: string;
  className?: string;
  containerClassName?: string;
  enableRowSelection?: boolean;
}>;

export function DataTable<TData extends Record<string, unknown>>({
  data,
  columns,
  rowKey = 'id' as keyof TData,
  rowActions,
  isLoading = false,
  emptyState,
  hasNextPage,
  hidePagination = false,
  currentPage,
  onNextPage,
  onPreviousPage,
  tableId,
  className,
  containerClassName,
  enableRowSelection = false,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const tableColumns: ColumnDef<TData>[] = [
    ...columns,
    ...(rowActions
      ? [
          {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
              <div className="flex items-center justify-end">
                {rowActions(row.original)}
              </div>
            ),
            enableSorting: false,
            meta: { className: 'w-px' },
          } as ColumnDef<TData>,
        ]
      : []),
  ];

  const table = useReactTable<TData>({
    data,
    columns: tableColumns,
    state: { sorting, rowSelection, columnVisibility },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: (row) => {
      if (typeof rowKey === 'function') return String(rowKey(row));
      return String(row[rowKey] ?? '');
    },
    manualPagination: true,
    manualFiltering: true,
  });

  return (
    <div className={cn('flex flex-1 flex-col min-h-0', className)}>
      <div className={cn('flex-1 overflow-auto min-h-0', containerClassName)}>
        <table id={tableId} className="w-full caption-bottom text-sm">
          <TableHeader className="sticky top-0 z-10 bg-background dark:bg-card shadow-[0_1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-border/40 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'sticky top-0 z-20 h-11 px-4 text-left align-middle font-bold text-[10.5px] uppercase tracking-widest text-muted-foreground/80 bg-background dark:bg-card shadow-[0_1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]',
                      (header.column.columnDef.meta as any)?.className,
                      (header.column.columnDef.meta as any)?.thClassName,
                    )}
                    style={{
                      width:
                        header.getSize() !== 150 ? header.getSize() : undefined,
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
                <TableRow key={`skeleton-${i}`} className="border-none">
                  {tableColumns.map((_, j) => (
                    <TableCell
                      key={`skeleton-${i}-${j}`}
                      className="bg-background dark:bg-card"
                    >
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  className="group/row border-b border-border/30 last:border-0 transition-colors duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'h-12 px-4 bg-background dark:bg-transparent group-hover/row:bg-gray-50/80 dark:group-hover/row:bg-white/5 group-data-[state=selected]/row:bg-muted transition-colors text-foreground/80 dark:text-gray-300',
                        (cell.column.columnDef.meta as any)?.className,
                        (cell.column.columnDef.meta as any)?.tdClassName,
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
                <TableCell colSpan={tableColumns.length} className="h-auto p-0">
                  <div className="flex items-center justify-center min-h-[300px] w-full">
                    {emptyState ?? <EmptyContent />}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>

      {!hidePagination && (
        <ServerlessPagination
          currentPage={currentPage ?? 1}
          hasNextPage={hasNextPage ?? false}
          onNextPage={onNextPage ?? (() => {})}
          onPreviousPage={onPreviousPage ?? (() => {})}
          className="mt-auto"
        />
      )}
    </div>
  );
}

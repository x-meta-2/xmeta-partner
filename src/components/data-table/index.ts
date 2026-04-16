/**
 * Data table system — re-exports.
 *
 * Pages should import from this barrel and never reach into individual files
 * or `@tanstack/react-table` directly.
 */
export { BaseTable } from './base-table';
export type { BaseTableProps, ToolbarConfig, TableConfig } from './base-table';

export { DataTableHeader } from './table-header';
export type { TableHeaderProps } from './table-header';

export { DataTableColumnHeader } from './column-header';
export { DataTableToolbar } from './toolbar';
export { DataTableFacetedFilter } from './faceted-filter';
export { DataTablePagination } from './pagination';
export { DataTableViewOptions } from './view-options';

// Cursor-paginated variant (existing).
export { DataTable as ServerlessTable } from './serverless-table';
export type { DataTableProps as ServerlessTableProps } from './serverless-table';
export { ServerlessPagination } from './serverless-pagination';

import { useEffect, useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { Input } from '#/components/ui/input';
import { useDebounce } from '#/hooks/use-debounce';
import { DataTableFacetedFilter } from './faceted-filter';

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchPlaceholder?: string;
  searchKey?: string;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  debounceDelay?: number;
};

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
  debounceDelay = 500,
}: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = useState(() => {
    if (searchKey) {
      return (table.getColumn(searchKey)?.getFilterValue() as string) ?? '';
    }
    return table.getState().globalFilter ?? '';
  });

  const debouncedSearchValue = useDebounce(searchValue, debounceDelay);

  useEffect(() => {
    if (searchKey) {
      const currentValue = table
        .getColumn(searchKey)
        ?.getFilterValue() as string;
      if (currentValue !== debouncedSearchValue) {
        table.getColumn(searchKey)?.setFilterValue(debouncedSearchValue);
      }
    } else {
      const currentValue = table.getState().globalFilter;
      if (currentValue !== debouncedSearchValue) {
        table.setGlobalFilter(debouncedSearchValue);
      }
    }
  }, [debouncedSearchValue, searchKey, table]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {searchKey !== undefined && (
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        <div className="flex gap-x-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId);
            if (!column) return null;
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

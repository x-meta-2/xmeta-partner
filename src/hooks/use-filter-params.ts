import { useMemo } from 'react';
import dayjs from 'dayjs';

import type { PaginationInput } from '#/services/types';

interface FilterParamsOptions {
  /** Default months to subtract for date range start */
  defaultMonths?: number;
  /** Default page size */
  defaultPageSize?: number;
  /** Field name used for the search query */
  searchKey?: string;
  /** Navigate fn for mutation (from getRouteApi().useNavigate()) */
  navigate?: (opts: {
    search: (prev: Record<string, unknown>) => Record<string, unknown>;
  }) => void;
}

/**
 * Parses URL search params into a normalized pagination/filter payload
 * for React Query. Returns params that match the backend API shape.
 *
 * Usage:
 *   const search = route.useSearch()
 *   const navigate = route.useNavigate()
 *   const { params, handleDateRangeChange } = useFilterParams(search, {
 *     defaultPageSize: 20,
 *     searchKey: 'query',
 *     navigate,
 *   })
 *
 *   const { data } = useQuery({
 *     queryKey: ['items', params],
 *     queryFn: () => itemsService.list(params),
 *   })
 */
export function useFilterParams(
  search: Record<string, unknown>,
  options: FilterParamsOptions = {},
) {
  const {
    defaultMonths = 0,
    defaultPageSize = 20,
    searchKey = 'query',
    navigate,
  } = options;

  const defaultDates = useMemo(() => {
    if (defaultMonths <= 0) return undefined;
    const today = dayjs();
    return {
      start_day: today.subtract(defaultMonths, 'month').format('YYYY-MM-DD'),
      end_day: today.format('YYYY-MM-DD'),
    };
  }, [defaultMonths]);

  const params: PaginationInput & Record<string, unknown> = useMemo(() => {
    const result: PaginationInput & Record<string, unknown> = {
      page: (search.page as number) || 1,
      pageSize: (search.pageSize as number) || defaultPageSize,
      query: (search[searchKey] as string) || '',
    };

    if (search.start_day || search.end_day || defaultMonths > 0) {
      result.sortDate = {
        start_day:
          (search.start_day as string) || defaultDates?.start_day || '',
        end_day: (search.end_day as string) || defaultDates?.end_day || '',
      };
    }

    // Forward other filter keys unchanged
    const reservedKeys = new Set([
      'page',
      'pageSize',
      searchKey,
      'start_day',
      'end_day',
    ]);
    Object.keys(search).forEach((key) => {
      if (!reservedKeys.has(key)) {
        const value = search[key];
        if (value !== undefined && value !== null && value !== '') {
          result[key] = value;
        }
      }
    });

    return result;
  }, [search, searchKey, defaultPageSize, defaultMonths, defaultDates]);

  const handleDateRangeChange = navigate
    ? (range: { start_day?: string; end_day?: string }) => {
        navigate({
          search: (prev) => ({
            ...prev,
            start_day: range.start_day,
            end_day: range.end_day,
            page: 1, // reset to first page when filters change
          }),
        });
      }
    : undefined;

  return { params, defaultDates, handleDateRangeChange };
}

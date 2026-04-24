/**
 * Shared API response shapes used across all services.
 *
 * Page-specific types live in `apis/{name}/{page}/types.ts`.
 */

export interface BaseResponse<T> {
  data: T;
  code: number;
  msg: string;
  status: string;
}

export interface PaginatedResponse<T> {
  data: {
    list: T[];
    total: number;
    lastEvaluatedKey?: string;
  };
  code: number;
  msg: string;
  status: string;
}

export interface FuturesResponse<T> {
  data: {
    items: T[];
  };
  msg: string;
  status: string;
}

export interface ConvertHistoryResponse<T> {
  code: number;
  items: T[];
  msg: string;
  timestamp: number;
}

export interface PaginationInput {
  page?: number;
  pageSize?: number;
  query?: string;
  sortDate?: {
    start_day: string;
    end_day: string;
  };
}

export interface PaginationOutput<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** @deprecated Use `BaseResponse<T>` instead. */
export type ApiResponse<T> = BaseResponse<T>;

/** @deprecated Use `PaginatedResponse<T>` instead. */
export type ApiResponseList<T> = PaginatedResponse<T>;

/** @deprecated Use `FuturesResponse<T>` instead. */
export type ApiResponseFutures<T> = FuturesResponse<T>;

/**
 * Common API response shapes shared across all domain services.
 */

export interface BaseResponse<T> {
  data: T;
  code: number;
  msg: string;
  status: string;
}

/**
 * @deprecated Use `BaseResponse<T>` instead.
 * Kept for backwards compatibility with legacy code.
 */
export type ApiResponse<T> = BaseResponse<T>;

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

/**
 * @deprecated Use `PaginatedResponse<T>` instead.
 * Kept for backwards compatibility with legacy code.
 */
export type ApiResponseList<T> = PaginatedResponse<T>;

/**
 * @deprecated Use `FuturesResponse<T>` instead.
 */
export type ApiResponseFutures<T> = FuturesResponse<T>;

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

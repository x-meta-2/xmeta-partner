/**
 * Services barrel — single entry point for partner-web APIs.
 *
 * Prefer direct imports in new code:
 *   import { getDashboardSummary } from '#/services/apis/partner/dashboard';
 */

export { default as baseService } from './base-service';

export type {
  BaseResponse,
  PaginatedResponse,
  PaginationInput,
  PaginationOutput,
} from './types';

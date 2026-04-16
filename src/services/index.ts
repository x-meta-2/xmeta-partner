/**
 * Services barrel — single import point for HTTP clients, services, and types.
 *
 *   import { partnerClient, authService, type Partner } from '#/services'
 */

// ---------- HTTP Clients ----------
export {
  partnerClient,
  apiClient,
  accountClient,
  securityClient,
  stakingClient,
  takeActionClient,
  configClient,
  legacyClient,
  ApiError,
  isApiError,
} from './api/client';

// ---------- Auth (used by features/auth flows) ----------
export { authService } from './api/auth.service';
export type {
  LoginRequest,
  LoginResponse,
  ConfirmMFARequest,
} from './api/auth.service';

// ---------- Partner domain services ----------
export {
  partnerService,
  dashboardService,
  referralsService,
  linksService,
  campaignsService,
  commissionsService,
  payoutsService,
  subAffiliatesService,
} from './api/partner';

// ---------- Misc shared services ----------
export * as countryService from './api/country-service';

// ---------- Partner domain types ----------
export type * from './types/partner.types';

// ---------- Auth & legacy types ----------
export type {
  BaseResponse,
  PaginatedResponse,
  FuturesResponse,
  ConvertHistoryResponse,
  PaginationInput,
  PaginationOutput,
} from './types/common.types';
export type * from './types/user.types';
export type * from './types/security.types';
export type * from './types/login.types';
export type * from './types/menu.types';
export type * from './types/country.types';

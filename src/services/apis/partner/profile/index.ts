import { api } from '#/config/api';
import baseService from '#/services/base-service';

import type { PartnerResponse, PartnerTier } from '../types';
import { unwrapPartner } from '../types';
import type {
  ApplyPartnerPayload,
  AuthStatus,
  Partner,
  PartnerApplication,
} from './types';

// Re-export value + type for const-as-type pattern
export { ApplicationStatus, PartnerStatus } from './types';
export type {
  ApplyPartnerPayload,
  AuthStatus,
  Partner,
  PartnerApplication,
  PartnerUser,
} from './types';

/** Full onboarding snapshot — called right after login. */
export const getAuthStatus = async () =>
  unwrapPartner<AuthStatus>(
    await baseService.get<PartnerResponse<AuthStatus>>(
      `${api.partner.auth}/status`,
    ),
  );

/** Submit a new partner application (any authenticated xmeta user). */
export const applyForPartner = async (payload: ApplyPartnerPayload) =>
  unwrapPartner<PartnerApplication>(
    await baseService.post<PartnerResponse<PartnerApplication>>(
      `${api.partner.auth}/apply`,
      payload,
    ),
  );

/** Active-partner-only: full partner profile with tier & user preload. */
export const getProfile = async () =>
  unwrapPartner<Partner>(
    await baseService.get<PartnerResponse<Partner>>(`${api.partner.auth}/info`),
  );

export const updateProfile = async (payload: Partial<Partner>) =>
  unwrapPartner<Partner>(
    await baseService.put<PartnerResponse<Partner>>(
      `${api.partner.auth}/profile`,
      payload,
    ),
  );

export const getTier = async () =>
  unwrapPartner<PartnerTier>(
    await baseService.get<PartnerResponse<PartnerTier>>(
      `${api.partner.auth}/tier`,
    ),
  );

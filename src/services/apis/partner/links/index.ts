import { api } from '#/config/api';
import baseService from '#/services/base-service';
import type {
  PartnerPaginated,
  PartnerPaginationInput,
  PartnerResponse,
} from '../types';
import { unwrapPartner } from '../types';
import type { ReferralLink } from './types';

export type { LinkStatus, ReferralLink } from './types';
export {
  REFERRAL_CODE_BLOCKED_REGEX,
  REFERRAL_CODE_MAX_COUNT,
  REFERRAL_CODE_MAX_LENGTH,
  REFERRAL_CODE_MIN_LENGTH,
  validateReferralCode,
} from './types';

export const listReferralLinks = async (
  params: PartnerPaginationInput = {},
) =>
  unwrapPartner<PartnerPaginated<ReferralLink>>(
    await baseService.post<PartnerResponse<PartnerPaginated<ReferralLink>>>(
      `${api.partner.links}/list`,
      params,
    ),
  );

export const createReferralLink = async (payload: { code: string }) =>
  unwrapPartner<ReferralLink>(
    await baseService.post<PartnerResponse<ReferralLink>>(
      `${api.partner.links}/create`,
      payload,
    ),
  );

export const updateReferralLink = async (
  id: string,
  payload: Partial<ReferralLink>,
) =>
  unwrapPartner<ReferralLink>(
    await baseService.put<PartnerResponse<ReferralLink>>(
      `${api.partner.links}/${id}`,
      payload,
    ),
  );

export const deleteReferralLink = async (id: string) =>
  unwrapPartner<null>(
    await baseService.delete<PartnerResponse<null>>(
      `${api.partner.links}/${id}`,
    ),
  );

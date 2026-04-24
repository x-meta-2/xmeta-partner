import { api } from '#/config/api';
import baseService from '#/services/base-service';
import type {
  PartnerPaginated,
  PartnerPaginationInput,
  PartnerResponse,
} from '../types';
import { unwrapPartner } from '../types';
import type { Referral, ReferralStats } from './types';

export type { KycStatus, Referral, ReferralStats, ReferralStatus } from './types';

export const listReferrals = async (params: PartnerPaginationInput = {}) =>
  unwrapPartner<PartnerPaginated<Referral>>(
    await baseService.post<PartnerResponse<PartnerPaginated<Referral>>>(
      `${api.partner.referrals}/list`,
      params,
    ),
  );

export const getReferral = async (id: string) =>
  unwrapPartner<Referral>(
    await baseService.get<PartnerResponse<Referral>>(
      `${api.partner.referrals}/detail/${id}`,
    ),
  );

export const getReferralStats = async () =>
  unwrapPartner<ReferralStats>(
    await baseService.get<PartnerResponse<ReferralStats>>(
      `${api.partner.referrals}/stats`,
    ),
  );

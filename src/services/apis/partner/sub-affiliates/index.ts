import { api } from '#/config/api';
import baseService from '#/services/base-service';
import type {
  PartnerPaginated,
  PartnerPaginationInput,
  PartnerResponse,
} from '../types';
import { unwrapPartner } from '../types';
import type { SubAffiliate, SubAffiliateStats } from './types';

export type {
  SubAffiliate,
  SubAffiliateStats,
  SubAffiliateStatus,
} from './types';

export const listSubAffiliates = async (params: PartnerPaginationInput = {}) =>
  unwrapPartner<PartnerPaginated<SubAffiliate>>(
    await baseService.post<PartnerResponse<PartnerPaginated<SubAffiliate>>>(
      `${api.partner.subAffiliates}/list`,
      params,
    ),
  );

export const inviteSubAffiliate = async (payload: {
  email: string;
  name?: string;
}) =>
  unwrapPartner<SubAffiliate>(
    await baseService.post<PartnerResponse<SubAffiliate>>(
      `${api.partner.subAffiliates}/invite`,
      payload,
    ),
  );

export const getSubAffiliateStats = async () =>
  unwrapPartner<SubAffiliateStats>(
    await baseService.post<PartnerResponse<SubAffiliateStats>>(
      `${api.partner.subAffiliates}/stats`,
      {},
    ),
  );

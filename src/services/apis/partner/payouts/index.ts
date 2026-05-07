import { api } from '#/config/api';
import baseService from '#/services/base-service';
import type {
  PartnerPaginated,
  PartnerPaginationInput,
  PartnerResponse,
} from '../types';
import { unwrapPartner } from '../types';
import type { Payout, PayoutDetail, PayoutSummary } from './types';

export type {
  Payout,
  PayoutDetail,
  PayoutItem,
  PayoutStatus,
  PayoutSummary,
} from './types';

export const listPayouts = async (params: PartnerPaginationInput = {}) =>
  unwrapPartner<PartnerPaginated<Payout>>(
    await baseService.post<PartnerResponse<PartnerPaginated<Payout>>>(
      `${api.partner.payouts}/list`,
      params,
    ),
  );

export const getPayout = async (id: string) =>
  unwrapPartner<PayoutDetail>(
    await baseService.get<PartnerResponse<PayoutDetail>>(
      `${api.partner.payouts}/detail/${id}`,
    ),
  );

export const getPendingPayouts = async () =>
  unwrapPartner<PayoutSummary>(
    await baseService.get<PartnerResponse<PayoutSummary>>(
      `${api.partner.payouts}/pending`,
    ),
  );

export const requestPayout = async () =>
  unwrapPartner<Payout>(
    await baseService.post<PartnerResponse<Payout>>(
      `${api.partner.payouts}/request`,
    ),
  );

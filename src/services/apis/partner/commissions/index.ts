import { api } from '#/config/api';
import baseService from '#/services/base-service';
import type {
  PartnerPaginated,
  PartnerPaginationInput,
  PartnerResponse,
} from '../types';
import { unwrapPartner } from '../types';
import type { Commission, CommissionBreakdown, DailyCommission } from './types';

export { CommissionStatus } from './types';
export type { Commission, CommissionBreakdown, DailyCommission } from './types';

export interface CommissionListParams extends PartnerPaginationInput {
  status?: string;
  referredUserId?: string;
}

export const listCommissions = async (params: CommissionListParams = {}) =>
  unwrapPartner<PartnerPaginated<Commission>>(
    await baseService.post<PartnerResponse<PartnerPaginated<Commission>>>(
      `${api.partner.commissions}/list`,
      params,
    ),
  );

export const getCommissionBreakdown = async () =>
  unwrapPartner<CommissionBreakdown>(
    await baseService.post<PartnerResponse<CommissionBreakdown>>(
      `${api.partner.commissions}/breakdown`,
      {},
    ),
  );

export const getDailyCommissionSummary = async () =>
  unwrapPartner<DailyCommission[]>(
    await baseService.post<PartnerResponse<DailyCommission[]>>(
      `${api.partner.commissions}/daily-summary`,
      {},
    ),
  );

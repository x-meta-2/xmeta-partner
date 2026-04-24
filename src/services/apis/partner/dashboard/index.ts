import { api } from '#/config/api';
import baseService from '#/services/base-service';
import type { PartnerResponse } from '../types';
import { unwrapPartner } from '../types';
import type {
  ChartPeriod,
  ChartPoint,
  DashboardSummary,
  ReferralChartPoint,
  TierProgress,
} from './types';

export type {
  ChartPeriod,
  ChartPoint,
  DashboardSummary,
  ReferralChartPoint,
  TierProgress,
} from './types';

export const getDashboardSummary = async () =>
  unwrapPartner<DashboardSummary>(
    await baseService.post<PartnerResponse<DashboardSummary>>(
      `${api.partner.dashboard}/summary`,
      {},
    ),
  );

export const getTierProgress = async () =>
  unwrapPartner<TierProgress>(
    await baseService.post<PartnerResponse<TierProgress>>(
      `${api.partner.dashboard}/tier-progress`,
      {},
    ),
  );

export const getEarningsChart = async (period: ChartPeriod = '30d') =>
  unwrapPartner<ChartPoint[]>(
    await baseService.post<PartnerResponse<ChartPoint[]>>(
      `${api.partner.dashboard}/earnings-chart`,
      { period },
    ),
  );

export const getReferralChart = async (period: ChartPeriod = '30d') =>
  unwrapPartner<ReferralChartPoint[]>(
    await baseService.post<PartnerResponse<ReferralChartPoint[]>>(
      `${api.partner.dashboard}/referral-chart`,
      { period },
    ),
  );

export interface PartnerResponse<T> {
  message: string;
  body: T | null;
}

export interface PartnerPaginated<T> {
  total: number;
  items: T[];
}

export interface PartnerPaginationInput {
  pageSize?: number;
  current?: number;
  query?: string;
  sortDate?: {
    start_day?: string;
    end_day?: string;
  };
}

export type TierName = string;

export interface PartnerTier {
  id: string;
  name: TierName;
  level: number;
  commissionRate: number;
  minActiveClients: number;
  minVolume: number;
  maxVolume: number | null;
  isDefault: boolean;
  color: string;
}

export const unwrapPartner = <T>(res: { data: PartnerResponse<T> }): T | null =>
  res.data.body;

export type SubAffiliateStatus = 'active' | 'inactive' | 'pending';

export interface SubAffiliate {
  id: string;
  name: string;
  referralCount: number;
  totalVolume: number;
  overrideCommission: number;
  status: SubAffiliateStatus;
  joinedAt: string;
}

export interface SubAffiliateStats {
  total: number;
  active: number;
  overrideEarned: number;
}

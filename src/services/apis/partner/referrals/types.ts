/**
 * Status logic:
 * - active: user made at least 1 futures trade in last 120 days
 * - inactive: no futures trade in last 120 days
 *
 * Note: email is NOT exposed — privacy requirement.
 */
export type ReferralStatus = 'active' | 'inactive';

export type KycStatus = 'verified' | 'pending' | 'rejected';

export interface Referral {
  id: string;
  userId: string;
  registrationDate: string;
  kycStatus: KycStatus;
  tradingVolume: number;
  commission: number;
  status: ReferralStatus;
  lastActive: string;
  note?: string;
}

export interface ReferralStats {
  total: number;
  verified: number;
  active: number;
  inactive: number;
  conversionRate: number;
}

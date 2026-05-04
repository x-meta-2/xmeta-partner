export const ReferralStatus = {
  Registered: 'registered',
  Active: 'active',
  Inactive: 'inactive',
  Unlinked: 'unlinked',
} as const;
export type ReferralStatus =
  (typeof ReferralStatus)[keyof typeof ReferralStatus];

export interface ReferredUser {
  id: string;
  maskedEmail: string;
  firstName: string;
  lastInitial: string;
  kycLevel: number;
}

export interface Referral {
  id: string;
  partnerId: string;
  referredUserId: string;
  referredUser: ReferredUser | null;
  referralLinkId: string | null;
  status: ReferralStatus;
  startedAt: string;
  endedAt: string | null;
  registeredAt: string;
  firstTradeAt: string | null;
  createdAt: string;
}

export interface ReferralStats {
  total: number;
  registered: number;
  active: number;
  inactive: number;
}

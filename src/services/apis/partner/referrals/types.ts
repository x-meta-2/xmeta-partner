/**
 * Mirrors `partner.ReferralListItem` returned by `/partner/referrals/list`.
 *
 * `status` lifecycle:
 *   - registered  → user signed up but hasn't deposited yet
 *   - deposited   → made first deposit
 *   - active      → traded futures within last 120 days
 *   - inactive    → no recent trade
 *   - unlinked    → switched away from this partner; row is historical
 *
 * The user object is intentionally PII-masked: partners only see a masked
 * email + first name + last initial. Full email, sub-account ids, and
 * capability flags stay server-side.
 */
export const ReferralStatus = {
  Registered: 'registered',
  Deposited: 'deposited',
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
  firstDepositAt: string | null;
  firstTradeAt: string | null;
  createdAt: string;
}

export interface ReferralStats {
  total: number;
  registered: number;
  deposited: number;
  active: number;
  inactive: number;
}

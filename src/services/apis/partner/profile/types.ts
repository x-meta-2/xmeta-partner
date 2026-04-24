import type { PartnerTier } from '../types';

/** Partner row lifecycle state (partners.status column). */
export const PartnerStatus = {
  Pending: 'pending',
  Active: 'active',
  Suspended: 'suspended',
} as const;
export type PartnerStatus = (typeof PartnerStatus)[keyof typeof PartnerStatus];

/** Partner application review state (partner_applications.status column). */
export const ApplicationStatus = {
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
} as const;

export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

/** Read-only user identity from the shared `users` table. */
export interface PartnerUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  kycLevel?: number;
  vipLevel?: number;
}

export interface Partner {
  id: string;
  userId: string;
  user: PartnerUser | null;
  tier: PartnerTier;
  status: PartnerStatus;
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  companyName?: string;
  phone?: string;
  country?: string;
  website?: string;
  createdAt: string;
}

export interface PartnerApplication {
  id: string;
  userId: string;
  companyName?: string;
  phone?: string;
  country?: string;
  website?: string;
  socialMedia?: Record<string, unknown>;
  audienceSize?: string;
  promotionPlan?: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  reviewedAt?: string;
  createdAt: string;
}

/** Snapshot returned by GET /partner/auth/status — drives the onboarding router. */
export interface AuthStatus {
  user: PartnerUser | null;
  partner: Partner | null;
  application: PartnerApplication | null;
}

export interface ApplyPartnerPayload {
  companyName?: string;
  phone?: string;
  country?: string;
  website?: string;
  socialMedia?: Record<string, unknown>;
  audienceSize?: string;
  promotionPlan?: string;
}

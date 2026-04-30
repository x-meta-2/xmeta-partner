/**
 * Referral link rules:
 * - Code: 5-7 uppercase alphanumeric characters (auto-generated default = 7)
 * - Max 3 links per partner — first one auto-created on partner approval
 * - Code itself is immutable; URL and is-active state are editable
 * - Regex validation: must NOT contain "XMETA" (case-insensitive)
 */
export type LinkStatus = 'active' | 'inactive';

export interface ReferralLink {
  id: string;
  code: string;
  url: string;
  clicks: number;
  registrations: number;
  isActive: boolean;
  createdAt: string;
}

export const REFERRAL_CODE_MIN_LENGTH = 5;
export const REFERRAL_CODE_MAX_LENGTH = 7;
export const REFERRAL_CODE_MAX_COUNT = 3;
export const REFERRAL_CODE_BLOCKED_REGEX = /XMETA/i;

export function validateReferralCode(code: string): string | null {
  if (code.length < REFERRAL_CODE_MIN_LENGTH) {
    return `Code must be at least ${REFERRAL_CODE_MIN_LENGTH} characters`;
  }
  if (code.length > REFERRAL_CODE_MAX_LENGTH) {
    return `Code must be at most ${REFERRAL_CODE_MAX_LENGTH} characters`;
  }
  if (!/^[A-Z0-9]+$/.test(code)) {
    return 'Code must contain only uppercase letters and numbers';
  }
  if (REFERRAL_CODE_BLOCKED_REGEX.test(code)) {
    return 'Code cannot contain "XMETA"';
  }
  return null;
}

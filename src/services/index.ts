/**
 * Services barrel — single entry point for all partner-web APIs and types.
 *
 * Prefer direct imports in new code:
 *   import { getDashboardSummary } from '#/services/apis/partner/dashboard';
 */

// ---------- HTTP Client ----------
export { default as baseService } from './base-service';

// ---------- Account ----------
export { LoginNextStepType } from './apis/account/auth';
export type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ConfirmMFARequest,
  LoginRequest,
  LoginResponse,
  UserData,
  UserProfileResponse,
} from './apis/account/auth';

// ---------- Security ----------
export type {
  VerificationCodeRequest,
  VerificationCodeResponse,
} from './apis/security/verification-code';
export type {
  AuthTokens,
  EmailVerification,
  PostMfaResponse,
  QrLoginCheckRequest,
  QrLoginCheckResponse,
  QrLoginRequestResponse,
  QrLoginSessionData,
  SecurityInfoType,
  SecurityRequest,
  SecurityResponse,
  SmsVerification,
  TokenVerification,
} from './apis/security/qr-login';

// ---------- Config ----------
export type { Country } from './apis/config/country';

// ---------- Partner shared ----------
export { TIER_REQUIREMENTS, unwrapPartner } from './apis/partner/types';
export type {
  PartnerPaginated,
  PartnerPaginationInput,
  PartnerResponse,
  PartnerTier,
  TierName,
} from './apis/partner/types';

// ---------- Partner pages ----------
export type { Partner, PartnerStatus } from './apis/partner/auth';
export type {
  ChartPeriod,
  ChartPoint,
  DashboardSummary,
  ReferralChartPoint,
  TierProgress,
} from './apis/partner/dashboard';
export type {
  KycStatus,
  Referral,
  ReferralStats,
  ReferralStatus,
} from './apis/partner/referrals';
export type { LinkStatus, ReferralLink } from './apis/partner/links';
export {
  REFERRAL_CODE_BLOCKED_REGEX,
  REFERRAL_CODE_MAX_COUNT,
  REFERRAL_CODE_MAX_LENGTH,
  REFERRAL_CODE_MIN_LENGTH,
  validateReferralCode,
} from './apis/partner/links';
export type { Campaign, CampaignStatus } from './apis/partner/campaigns';
export type {
  Commission,
  CommissionBreakdown,
  CommissionStatus,
  CommissionType,
  DailyCommission,
} from './apis/partner/commissions';
export type {
  Payout,
  PayoutStatus,
  PayoutSummary,
} from './apis/partner/payouts';
export type {
  SubAffiliate,
  SubAffiliateStats,
  SubAffiliateStatus,
} from './apis/partner/sub-affiliates';
export type {
  MonthlyPerformance,
  PerformanceStats,
} from './apis/partner/performance';

// ---------- Common types ----------
export type {
  BaseResponse,
  ConvertHistoryResponse,
  FuturesResponse,
  PaginatedResponse,
  PaginationInput,
  PaginationOutput,
} from './types';

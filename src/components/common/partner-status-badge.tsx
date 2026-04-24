import { Badge } from '#/components/ui/badge';
import {
  ApplicationStatus,
  PartnerStatus,
  type Partner,
  type PartnerApplication,
  type PartnerUser,
} from '#/services/apis/partner/profile';

type Variant = 'default' | 'success' | 'warning' | 'destructive' | 'muted';

interface StatusInfo {
  label: string;
  variant: Variant;
}

const KYC_REQUIRED_LEVEL = 1;

/** Derive the onboarding / partner status from store snapshots. */
export function derivePartnerStatus(
  partner: Partner | undefined | null,
  application: PartnerApplication | undefined | null,
  user?: PartnerUser | undefined | null,
): StatusInfo {
  if (partner?.status === PartnerStatus.Active) {
    return { label: 'Active partner', variant: 'success' };
  }
  if (partner?.status === PartnerStatus.Suspended) {
    return { label: 'Suspended', variant: 'destructive' };
  }
  if (application?.status === ApplicationStatus.Pending) {
    return { label: 'Application pending', variant: 'warning' };
  }
  if (application?.status === ApplicationStatus.Rejected) {
    return { label: 'Application rejected', variant: 'destructive' };
  }
  if (user && (user.kycLevel ?? 0) < KYC_REQUIRED_LEVEL) {
    return { label: 'Verify identity', variant: 'warning' };
  }
  return { label: 'Not a partner', variant: 'muted' };
}

/**
 * PartnerStatusBadge — reusable status pill driven by Badge's token variants.
 */
export function PartnerStatusBadge({
  partner,
  application,
  user,
}: {
  partner: Partner | undefined | null;
  application: PartnerApplication | undefined | null;
  user?: PartnerUser | undefined | null;
}) {
  const { label, variant } = derivePartnerStatus(partner, application, user);
  return <Badge variant={variant}>{label}</Badge>;
}

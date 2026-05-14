import { Badge } from '#/components/ui/badge';
import { useI18n } from '#/i18n/context';
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

type TranslateFn = (key: string, defaultValue?: string) => string;

export function derivePartnerStatus(
  partner: Partner | undefined | null,
  application: PartnerApplication | undefined | null,
  user?: PartnerUser | undefined | null,
  t?: TranslateFn,
): StatusInfo {
  const tr = (key: string, fallback: string) => (t ? t(key) : fallback);

  if (partner?.status === PartnerStatus.Active) {
    return { label: tr('partner:partnerStatus.active', 'Active partner'), variant: 'success' };
  }
  if (partner?.status === PartnerStatus.Suspended) {
    return { label: tr('partner:partnerStatus.suspended', 'Suspended'), variant: 'destructive' };
  }
  if (application?.status === ApplicationStatus.Pending) {
    return { label: tr('partner:partnerStatus.pending', 'Application pending'), variant: 'warning' };
  }
  if (application?.status === ApplicationStatus.Rejected) {
    return { label: tr('partner:partnerStatus.rejected', 'Application rejected'), variant: 'destructive' };
  }
  if (user && (user.kycLevel ?? 0) < KYC_REQUIRED_LEVEL) {
    return { label: tr('partner:partnerStatus.notVerified', 'Verify identity'), variant: 'warning' };
  }
  return { label: tr('partner:partnerStatus.notPartner', 'Not a partner'), variant: 'muted' };
}

export function PartnerStatusBadge({
  partner,
  application,
  user,
}: {
  partner: Partner | undefined | null;
  application: PartnerApplication | undefined | null;
  user?: PartnerUser | undefined | null;
}) {
  const { t } = useI18n();
  const { label, variant } = derivePartnerStatus(partner, application, user, t);
  return <Badge variant={variant}>{label}</Badge>;
}

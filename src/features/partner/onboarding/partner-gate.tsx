import type { ReactNode } from 'react';

import {
  ApplicationStatus,
  PartnerStatus,
} from '#/services/apis/partner/profile';
import { useAuthStore } from '#/stores/auth-store';

import { NotPartnerCard } from './not-partner-card';
import { NotVerifiedCard } from './not-verified-card';
import { PendingApplication } from './pending';
import { RejectedApplication } from './rejected';
import { SuspendedPartner } from './suspended';

const KYC_REQUIRED_LEVEL = 1;

/**
 * PartnerGate — decorates every dashboard page. Only active partners see the
 * real content; others see the card matching their state.
 */
export function PartnerGate({ children }: { children: ReactNode }) {
  const partner = useAuthStore((s) => s.auth.partner);
  const application = useAuthStore((s) => s.auth.application);
  const user = useAuthStore((s) => s.auth.user);

  if (partner?.status === PartnerStatus.Active) {
    return <>{children}</>;
  }

  if (partner?.status === PartnerStatus.Suspended) {
    return <SuspendedPartner />;
  }

  if (application?.status === ApplicationStatus.Pending) {
    return <PendingApplication submittedAt={application.createdAt} />;
  }

  if (application?.status === ApplicationStatus.Rejected) {
    return (
      <RejectedApplication
        reason={application.rejectionReason}
        prefill={{
          companyName: application.companyName,
          website: application.website,
          facebookUrl: extractSocial(application.socialMedia, 'facebook'),
          instagramUrl: extractSocial(application.socialMedia, 'instagram'),
        }}
      />
    );
  }

  if ((user?.kycLevel ?? 0) < KYC_REQUIRED_LEVEL) {
    return <NotVerifiedCard />;
  }

  return <NotPartnerCard />;
}

function extractSocial(
  social: Record<string, unknown> | undefined,
  key: string,
): string | undefined {
  if (!social) return undefined;
  const v = social[key];
  return typeof v === 'string' ? v : undefined;
}

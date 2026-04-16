import { createFileRoute } from '@tanstack/react-router';
import { PartnerReferralsPage } from '#/features/partner/referrals';

export const Route = createFileRoute('/$locale/_authenticated/dashboard/referrals')({
  component: PartnerReferralsPage,
});

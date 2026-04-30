import { createFileRoute } from '@tanstack/react-router';
import { PartnerPayoutsPage } from '#/features/partner/payouts';

export const Route = createFileRoute(
  '/$locale/_authenticated/dashboard/payouts',
)({
  component: PartnerPayoutsPage,
});

import { createFileRoute } from '@tanstack/react-router';
import { PartnerDashboardPage } from '#/features/partner/dashboard';

export const Route = createFileRoute('/$locale/_authenticated/dashboard/overview')({
  component: PartnerDashboardPage,
});

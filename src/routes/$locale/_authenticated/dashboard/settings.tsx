import { createFileRoute } from '@tanstack/react-router';
import { PartnerSettingsPage } from '#/features/partner/settings';

export const Route = createFileRoute(
  '/$locale/_authenticated/dashboard/settings',
)({
  component: PartnerSettingsPage,
});

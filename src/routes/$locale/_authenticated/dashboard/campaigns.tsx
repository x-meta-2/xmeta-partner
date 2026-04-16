import { createFileRoute } from '@tanstack/react-router';
import { PartnerCampaignsPage } from '#/features/partner/campaigns';

export const Route = createFileRoute('/$locale/_authenticated/dashboard/campaigns')({
  component: PartnerCampaignsPage,
});

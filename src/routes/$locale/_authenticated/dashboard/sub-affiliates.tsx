import { createFileRoute } from '@tanstack/react-router';
import { PartnerSubAffiliatesPage } from '#/features/partner/sub-affiliates';

export const Route = createFileRoute(
  '/$locale/_authenticated/dashboard/sub-affiliates',
)({
  component: PartnerSubAffiliatesPage,
});

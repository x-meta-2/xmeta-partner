import { createFileRoute } from '@tanstack/react-router';
import { PartnerEarningsPage } from '#/features/partner/earnings';

export const Route = createFileRoute('/$locale/_authenticated/dashboard/earnings')({
  component: PartnerEarningsPage,
});

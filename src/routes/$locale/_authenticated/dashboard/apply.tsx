import { createFileRoute } from '@tanstack/react-router';

import { ApplyPartnerForm } from '#/features/partner/onboarding/apply-form';

export const Route = createFileRoute('/$locale/_authenticated/dashboard/apply')({
  component: ApplyPartnerForm,
});

import { createFileRoute } from '@tanstack/react-router';
import { PartnerLinksPage } from '#/features/partner/links';

export const Route = createFileRoute('/$locale/_authenticated/dashboard/links')(
  {
    component: PartnerLinksPage,
  },
);

import { SelectMfaTypePage } from '#/features/auth/select-mfa-type';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/(auth)/select-mfa-type')({
  component: SelectMfaTypePage,
});

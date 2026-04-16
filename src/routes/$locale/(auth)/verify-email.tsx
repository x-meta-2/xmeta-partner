import { createFileRoute } from '@tanstack/react-router';
import { VerifyEmailPage } from '#/features/auth/verify-email';

export const Route = createFileRoute('/$locale/(auth)/verify-email')({
  component: VerifyEmailPage,
});

import { createFileRoute } from '@tanstack/react-router';
import { VerifyPhonePage } from '#/features/auth/verify-phone';

export const Route = createFileRoute('/$locale/(auth)/verify-phone')({
  component: VerifyPhonePage,
});

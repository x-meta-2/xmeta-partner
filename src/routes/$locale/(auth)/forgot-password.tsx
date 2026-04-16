import { ForgotPasswordPage } from '#/features/auth/forgot-password';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/(auth)/forgot-password')({
  component: ForgotPasswordPage,
});


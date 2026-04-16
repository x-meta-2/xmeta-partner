import { NewPasswordRequiredPage } from '#/features/auth/new-password-required';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/(auth)/new-password-required')({
  component: NewPasswordRequiredPage,
});

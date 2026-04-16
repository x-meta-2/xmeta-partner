import { createFileRoute } from '@tanstack/react-router';
import { RegisterPage } from '#/features/auth/register';

export const Route = createFileRoute('/$locale/(auth)/register')({
  component: RegisterPage,
});


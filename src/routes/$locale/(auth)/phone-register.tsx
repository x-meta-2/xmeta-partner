import { PhoneRegisterPage } from '#/features/auth/phone-register';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/(auth)/phone-register')({
  component: PhoneRegisterPage,
});

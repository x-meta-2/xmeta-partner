import { SmsMfaPage } from '#/features/auth/sms-mfa';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/(auth)/sms-mfa')({
  component: SmsMfaPage,
});

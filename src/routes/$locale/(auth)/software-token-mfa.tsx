import { SoftwareTokenMfaPage } from '#/features/auth/software-token-mfa';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/(auth)/software-token-mfa')({
  component: SoftwareTokenMfaPage,
});

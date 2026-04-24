import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

import { LoginPage } from '#/features/auth/login';
import { refreshAuth } from '#/stores/auth-actions';
import { useAuthStore } from '#/stores/auth-store';

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export type LoginSearch = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/$locale/(auth)/login')({
  validateSearch: searchSchema,
  beforeLoad: async ({ params }) => {
    if (typeof window === 'undefined') return;

    // If the user already has a valid Cognito session, bounce them to the
    // dashboard — the _authenticated gate decides which screen (real
    // dashboard / onboarding card / suspended / etc.) to show.
    const current = useAuthStore.getState().auth;
    if (!current.isAuthenticated && current.authLoading) {
      await refreshAuth(false);
    }

    if (useAuthStore.getState().auth.isAuthenticated) {
      throw redirect({
        to: '/$locale/dashboard/overview',
        params: { locale: params.locale },
      });
    }
  },
  component: LoginPage,
});

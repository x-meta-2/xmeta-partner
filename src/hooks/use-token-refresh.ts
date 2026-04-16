import { useEffect } from 'react';

import { refreshAuth } from '#/stores/auth-actions';
import { useAuthStore } from '#/stores/auth-store';

/**
 * Automatically refreshes Cognito tokens every 50 minutes (tokens expire at 60m).
 *
 * Mount this once at the app root (in `__root.tsx`) to keep sessions alive
 * without relying on per-request token refreshes.
 */
export function useTokenRefresh() {
  const isAuthenticated = useAuthStore((s) => s.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      () => {
        void refreshAuth(true);
      },
      50 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [isAuthenticated]);
}

import { useCallback } from 'react';
import { useRouter, useRouterState } from '@tanstack/react-router';

import { localeFromPathname } from '#/i18n/routing';
import type { Locale } from '#/i18n/locales';

/**
 * Locale-aware navigation helper.
 *
 * Wraps TanStack Router's `useRouter().navigate()` so you don't have to
 * manually pass `params: { locale }` on every single navigation call.
 *
 * The current locale is read from the URL on every invocation, so it always
 * reflects the user's actual language — even if they just switched via
 * the language toggle.
 *
 * Usage:
 *   const navigate = useLocalizedNavigate()
 *
 *   // Instead of:
 *   //   router.navigate({
 *   //     to: '/$locale/dashboard/overview',
 *   //     params: { locale: locale || 'en' },  // ❌ wrong default
 *   //   })
 *   //
 *   // Write:
 *   navigate('/dashboard/overview')              // ✅ locale auto-injected
 *   navigate('/$locale/login')                   // also works
 *   navigate({ to: '/dashboard/overview' })      // object form too
 */
export function useLocalizedNavigate() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return useCallback(
    async (
      target:
        | string
        | {
            to: string;
            search?: Record<string, unknown>;
            replace?: boolean;
          },
      options?: { replace?: boolean },
    ) => {
      const locale: Locale = localeFromPathname(pathname);
      const to = typeof target === 'string' ? target : target.to;
      const search = typeof target === 'object' ? target.search : undefined;
      const replace =
        typeof target === 'object' ? target.replace : options?.replace;

      // Accept both `/dashboard/overview` and `/$locale/dashboard/overview`
      // and also full `/mn/dashboard/overview` paths.
      const normalized = normalizeRoutePath(to);

      await router.navigate({
        to: normalized,
        params: { locale },
        search,
        replace,
      } as never);
    },
    [router, pathname],
  );
}

/**
 * Normalize a navigation target to the `$locale/...` form TanStack Router
 * expects. Accepts:
 *   '/dashboard/overview'             → '/$locale/dashboard/overview'
 *   '/$locale/dashboard/overview'     → '/$locale/dashboard/overview'  (unchanged)
 *   '/mn/dashboard/overview'          → '/$locale/dashboard/overview'  (strip locale)
 *   '/en/login'                       → '/$locale/login'               (strip locale)
 */
function normalizeRoutePath(to: string): string {
  if (!to.startsWith('/')) {
    return `/$locale/${to}`;
  }

  if (to.startsWith('/$locale')) {
    return to;
  }

  // Strip a hard-coded locale prefix like `/mn/...` or `/en/...`
  const match = /^\/(mn|en)(\/.*|$)/.exec(to);
  if (match) {
    return `/$locale${match[2] || ''}`;
  }

  return `/$locale${to}`;
}

import { useCallback } from 'react'
import { useRouter, useRouterState } from '@tanstack/react-router'

import { localeFromPathname, stripLocalePrefix } from '#/i18n/routing'
import type { Locale } from '#/i18n/locales'

/**
 * Default destination after a successful login/MFA, when no `redirect`
 * search param is present.
 */
const DEFAULT_POST_LOGIN_PATH = '/dashboard/overview'

/**
 * Post-authentication navigation helper.
 *
 * After a successful login, signup, or MFA confirmation, this helper
 * navigates the user to:
 *
 *   1. The URL stored in the `redirect` search param (set by the auth guard
 *      in `_authenticated/route.tsx` when they tried to visit a protected
 *      page while unauthenticated), OR
 *
 *   2. The default post-login page (`/dashboard/overview`) if there was no
 *      original destination.
 *
 * This replaces hard-coded `router.navigate({ to: '/$locale/dashboard/...' })`
 * calls scattered throughout auth features.
 *
 * Usage:
 *   const goToPostLoginDestination = usePostAuthNavigation()
 *
 *   const onLoginSuccess = async () => {
 *     await refreshAuth()
 *     await goToPostLoginDestination()
 *   }
 */
export function usePostAuthNavigation() {
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const search = useRouterState({ select: (s) => s.location.search }) as {
    redirect?: string
  }

  return useCallback(async () => {
    const locale: Locale = localeFromPathname(pathname)

    // Validate the redirect param — prevent open-redirect vulnerabilities.
    // Only accept same-origin absolute paths.
    const redirectParam = search.redirect
    const safeRedirect =
      typeof redirectParam === 'string' &&
      redirectParam.startsWith('/') &&
      !redirectParam.startsWith('//') // reject `//evil.com`
        ? redirectParam
        : null

    if (safeRedirect) {
      // The redirect param may or may not include a locale prefix.
      // Strip any existing locale and re-inject the current one so the
      // user stays in their chosen language.
      const stripped = stripLocalePrefix(safeRedirect)
      await router.navigate({
        to: `/$locale${stripped === '/' ? '' : stripped}`,
        params: { locale },
      } as never)
      return
    }

    // No redirect → go to the default post-login page.
    await router.navigate({
      to: `/$locale${DEFAULT_POST_LOGIN_PATH}`,
      params: { locale },
    } as never)
  }, [router, pathname, search.redirect])
}

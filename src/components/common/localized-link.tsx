import { Link, useRouterState } from '@tanstack/react-router';
import { forwardRef, type ComponentProps } from 'react';

import { localeFromPathname } from '#/i18n/routing';

type LinkBaseProps = Omit<
  ComponentProps<typeof Link>,
  'to' | 'params'
>;

/**
 * Locale-aware `<Link>` wrapper.
 *
 * Removes the boilerplate of writing `to="/$locale/foo" params={{ locale }}`
 * on every link. Instead just pass the route without the locale prefix:
 *
 *   <LocalizedLink to="/dashboard/overview">Dashboard</LocalizedLink>
 *
 * The current locale is read from the URL on every render, so the link
 * always points to the user's active language.
 *
 * Accepted forms (all resolve to the same URL):
 *   <LocalizedLink to="/login">           // bare path
 *   <LocalizedLink to="/$locale/login">   // explicit
 *   <LocalizedLink to="/mn/login">        // locale-prefixed (auto-stripped)
 */
type LocalizedLinkProps = LinkBaseProps & {
  to: string;
  params?: Record<string, string>;
};

export const LocalizedLink = forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  function LocalizedLink({ to, params, ...rest }, ref) {
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const locale = localeFromPathname(pathname);

    const normalized = normalizeRoutePath(to);

    // The TanStack Router `to` prop is strictly typed against the generated
    // routeTree. We accept a plain string here to avoid duplicating that
    // entire union — typos still surface at runtime via the router itself.
    return (
      <Link
        ref={ref}
        {...(rest as object)}
        to={normalized as never}
        params={{ locale, ...params } as never}
      />
    );
  },
);

function normalizeRoutePath(to: string): string {
  if (!to) return '/$locale';
  if (!to.startsWith('/')) return `/$locale/${to}`;
  if (to.startsWith('/$locale')) return to;

  const match = /^\/(mn|en)(\/.*|$)/.exec(to);
  if (match) {
    return `/$locale${match[2] || ''}`;
  }

  return `/$locale${to}`;
}

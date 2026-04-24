import { useEffect } from 'react';
import { ErrorBoundary } from '#/components/common/error-boundary';
import { LandingTopBar } from '#/components/layout/landing-topbar';
import { PartnerFooter } from '#/components/layout/partner-footer';
import { PartnerTopBar } from '#/components/layout/partner-topbar';
import { I18nProvider } from '#/i18n/context';
import type { Locale } from '#/i18n/locales';
import { localeFromPathname, switchLocalePathname } from '#/i18n/routing';
import { queryClient } from '#/lib/query-client';
import { Toaster } from '#/components/ui/sonner';
import { useTokenRefresh } from '#/hooks/use-token-refresh';
import { refreshAuth } from '#/stores/auth-actions';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router';
import appCss from '../styles.css?url';

/**
 * Bootstrap the Cognito session once at mount. Partner/application status
 * is fetched by the `_authenticated` route guard — keeping that single
 * owner avoids firing `/status` twice on every navigation.
 */
function AuthBootstrap() {
  useTokenRefresh();

  useEffect(() => {
    void refreshAuth(true);
  }, []);

  return null;
}

const THEME_INIT_SCRIPT = `window.global = window.global || window;(function(){try{var stored=window.localStorage.getItem('x-meta-theme');if(!stored){var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;stored=prefersDark?'dark':'light';window.localStorage.setItem('x-meta-theme',stored)}if(stored==='dark'){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark')}else{document.documentElement.classList.remove('dark');document.documentElement.removeAttribute('data-theme')}document.documentElement.style.colorScheme=stored;}catch(e){}})();`;

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg text-gray-600">Page not found</p>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'X-Meta Крипто бирж',
      },
      {
        name: 'description',
        content:
          'IHC, Bitcoin, Ethereum, USDT болон бусад 1000+ криптовалютыг аюулгүй бас хурдан арилжих боломжийг X-Meta крипто бирж танд санал болгож байна.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function RootLayout({
  children,
  locale,
  pathname,
}: Readonly<{
  children: React.ReactNode;
  locale: Locale;
  pathname: string;
}>) {
  const isAuthPage =
    pathname.includes('/auth/') ||
    pathname.endsWith('/login') ||
    pathname.endsWith('/register') ||
    pathname.endsWith('/forgot-password');
  const isDashboard = pathname.includes('/dashboard');
  const isLanding = !isAuthPage && !isDashboard;

  return (
    <I18nProvider locale={locale}>
      {isLanding && <LandingTopBar />}
      {isDashboard && <PartnerTopBar />}
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      {!isAuthPage && <PartnerFooter />}
    </I18nProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = localeFromPathname(pathname);
  const canonicalPath = pathname;
  const alternateMn = switchLocalePathname(pathname, 'mn');
  const alternateEn = switchLocalePathname(pathname, 'en');

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="canonical" href={`https://www.x-meta.com${canonicalPath}`} />
        <link
          rel="alternate"
          hrefLang="mn"
          href={`https://www.x-meta.com${alternateMn}`}
        />
        <link
          rel="alternate"
          hrefLang="en"
          href={`https://www.x-meta.com${alternateEn}`}
        />
        <HeadContent />
      </head>
      <body className="bg-background text-foreground transition-colors duration-300">
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <AuthBootstrap />
            <RootLayout locale={locale} pathname={pathname}>
              {children}
            </RootLayout>
          </ErrorBoundary>
        </QueryClientProvider>
        <Toaster position="top-right" />
        <Scripts />
      </body>
    </html>
  );
}

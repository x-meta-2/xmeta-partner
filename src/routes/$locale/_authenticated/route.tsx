import { useEffect } from 'react';
import {
  createFileRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';

import { PageLoader } from '#/components/common/page-loader';
import { DashboardLayout } from '#/components/layout/dashboard-layout';
import { DashboardSidebar } from '#/components/sidebar/dashboard-sidebar';
import { DashboardSidebarMobile } from '#/components/sidebar/dashboard-sidebar-mobile';
import { PartnerGate } from '#/features/partner/onboarding/partner-gate';
import { useLocalizedNavigate } from '#/hooks/use-localized-navigate';
import { loadUserProfile } from '#/stores/auth-actions';
import { useAuthStore } from '#/stores/auth-store';

// Auth + profile bootstrap lives here in client `useEffect`s rather than
// `beforeLoad`. TanStack Start runs `beforeLoad` on the server during SSR
// and does NOT re-run it on client hydration, so any `/status` call placed
// there would silently never fire on the client.
export const Route = createFileRoute('/$locale/_authenticated')({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const authLoading = useAuthStore((s) => s.auth.authLoading);
  const isAuthenticated = useAuthStore((s) => s.auth.isAuthenticated);
  const userLoaded = useAuthStore((s) => s.auth.userLoaded);
  const navigate = useLocalizedNavigate();

  // Fetch the partner/application snapshot every time the dashboard mounts
  // for an authenticated user — covers hard refresh AND post-login
  // navigation (where root-level `AuthBootstrap` already mounted earlier).
  useEffect(() => {
    if (isAuthenticated && !userLoaded) {
      void loadUserProfile();
    }
  }, [isAuthenticated, userLoaded]);

  // Once Cognito hydration finishes, redirect unauthenticated users to login.
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      void navigate('/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Block render until we know who the user is + have the fresh /status
  // snapshot. Without this gate, persisted user data flashes the wrong
  // onboarding card before partner/application populate.
  if (authLoading || (isAuthenticated && !userLoaded)) {
    return <PageLoader fullScreen />;
  }
  if (!isAuthenticated) return null;

  return (
    <DashboardLayout
      sidebarContent={<DashboardSidebar />}
      mobileSidebarContent={<DashboardSidebarMobile />}
    >
      <GatedOutlet />
    </DashboardLayout>
  );
}

// /dashboard/apply is the apply form itself — bypass PartnerGate.
// Every other dashboard route renders inside the gate, so non-partners see
// the onboarding card in place of the real page.
function GatedOutlet() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isApplyRoute = pathname.includes('/dashboard/apply');

  if (isApplyRoute) {
    return <Outlet />;
  }

  return (
    <PartnerGate>
      <Outlet />
    </PartnerGate>
  );
}

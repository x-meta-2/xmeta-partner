import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router';

import { PageLoader } from '#/components/common/page-loader';
import { DashboardLayout } from '#/components/layout/dashboard-layout';
import { DashboardSidebar } from '#/components/sidebar/dashboard-sidebar';
import { DashboardSidebarMobile } from '#/components/sidebar/dashboard-sidebar-mobile';
import { PartnerGate } from '#/features/partner/onboarding/partner-gate';
import { loadUserProfile, refreshAuth } from '#/stores/auth-actions';
import { useAuthStore } from '#/stores/auth-store';

// Block the FIRST authenticated navigation this session until partner
// status is fresh. Subsequent clicks stay instant and refresh in background.
// Reset on logout so the next login re-blocks.
let statusHydrated = false;

export const Route = createFileRoute('/$locale/_authenticated')({
  beforeLoad: async ({ location, params }) => {
    if (typeof window === 'undefined') return;

    // Hydrate Cognito session on hard refresh / direct navigation.
    const current = useAuthStore.getState().auth;
    if (!current.isAuthenticated && current.authLoading) {
      await refreshAuth(false);
    }

    const { isAuthenticated } = useAuthStore.getState().auth;
    if (!isAuthenticated) {
      statusHydrated = false;
      throw redirect({
        to: '/$locale/login',
        params: { locale: params.locale },
        search: { redirect: location.href },
      });
    }

    if (!statusHydrated) {
      await loadUserProfile();
      statusHydrated = true;
    }
    // Intentionally no background refresh here — call `loadUserProfile()`
    // explicitly from mutations (apply, update profile) when data changes.
  },
  pendingComponent: PendingLayout,
  component: AuthenticatedLayout,
});

function PendingLayout() {
  return <PageLoader fullScreen />;
}

function AuthenticatedLayout() {
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

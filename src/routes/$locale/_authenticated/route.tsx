import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { DashboardSidebar } from '#/components/sidebar/dashboard-sidebar';
import { DashboardSidebarMobile } from '#/components/sidebar/dashboard-sidebar-mobile';
import { DashboardLayout } from '#/components/layout/dashboard-layout';
import { refreshAuth } from '#/stores/auth-actions';
import { useAuthStore } from '#/stores/auth-store';

export const Route = createFileRoute('/$locale/_authenticated')({
  beforeLoad: async ({ location, params }) => {
    // SSR has no localStorage / Cognito tokens — skip guard, client re-runs.
    if (typeof window === 'undefined') return;

    // Hydrate Cognito session on hard refresh / direct navigation.
    const current = useAuthStore.getState().auth;
    if (!current.isAuthenticated && current.authLoading) {
      await refreshAuth(false);
    }

    const isAuthenticated = useAuthStore.getState().auth.isAuthenticated;
    if (!isAuthenticated) {
      throw redirect({
        to: '/$locale/login',
        params: { locale: params.locale },
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <DashboardLayout
      sidebarContent={<DashboardSidebar />}
      mobileSidebarContent={<DashboardSidebarMobile />}
    >
      <Outlet />
    </DashboardLayout>
  );
}

import { createFileRoute, Outlet } from '@tanstack/react-router';

import { DashboardSidebar } from '#/components/sidebar/dashboard-sidebar';
import { DashboardSidebarMobile } from '#/components/sidebar/dashboard-sidebar-mobile';
import { DashboardLayout } from '#/components/layout/dashboard-layout';

/**
 * Layout route for all authenticated pages.
 *
 * File path: src/routes/$locale/_authenticated/route.tsx
 * URL: `_authenticated` is a layout segment — it does NOT appear in the URL.
 *
 *   src/routes/$locale/_authenticated/dashboard/overview.tsx  →  /mn/dashboard/overview
 *   src/routes/$locale/_authenticated/dashboard/wallet/spot.tsx → /mn/dashboard/wallet/spot
 *
 * Auth guard runs before any child route renders — unauthenticated users
 * are redirected to `/$locale/login` with `redirect` search param preserving
 * the original destination.
 */
export const Route = createFileRoute('/$locale/_authenticated')({
  // TODO Phase 2: re-enable auth guard once login is wired to the partner
  // Cognito pool. Temporarily disabled so mock-data pages are browsable.
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

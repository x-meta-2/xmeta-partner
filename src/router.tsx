import { createRouter as createTanStackRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,

    scrollRestoration: true,
    // Preload disabled intentionally. Dashboard pages are gated by partner
    // status — preloading on hover could kick off `/dashboard/*` queries
    // before the gate has confirmed the user is an active partner.
    defaultPreload: false,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

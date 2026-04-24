import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  Partner,
  PartnerApplication,
  PartnerUser,
} from '#/services/apis/partner/profile';

/**
 * Auth store — Zustand-based, persisted, single source of truth for
 * post-login session state.
 *
 * The three nullable fields drive the onboarding router:
 *   partner === active      → dashboard
 *   partner === suspended   → suspended screen
 *   !partner + application.pending  → "under review"
 *   !partner + application.rejected → reapply screen
 *   !partner + !application → apply form
 */

interface AuthSlice {
  accessToken: string;
  idToken: string;
  user: PartnerUser | undefined;
  partner: Partner | undefined;
  application: PartnerApplication | undefined;
  authLoading: boolean;
  userLoading: boolean;
  isAuthenticated: boolean;

  setAccessToken: (token: string) => void;
  setIdToken: (token: string) => void;
  setUser: (user: PartnerUser | undefined) => void;
  setPartner: (partner: Partner | undefined) => void;
  setApplication: (application: PartnerApplication | undefined) => void;
  setAuthLoading: (loading: boolean) => void;
  setUserLoading: (loading: boolean) => void;
  reset: () => void;
}

interface AuthState {
  auth: AuthSlice;
}

const initialAuth = {
  accessToken: '',
  idToken: '',
  user: undefined,
  partner: undefined,
  application: undefined,
  authLoading: true,
  userLoading: false,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: {
        ...initialAuth,

        setAccessToken: (accessToken) =>
          set((state) => ({
            auth: {
              ...state.auth,
              accessToken,
              isAuthenticated: Boolean(accessToken),
            },
          })),

        setIdToken: (idToken) =>
          set((state) => ({
            auth: { ...state.auth, idToken },
          })),

        setUser: (user) =>
          set((state) => ({
            auth: { ...state.auth, user },
          })),

        setPartner: (partner) =>
          set((state) => ({
            auth: { ...state.auth, partner },
          })),

        setApplication: (application) =>
          set((state) => ({
            auth: { ...state.auth, application },
          })),

        setAuthLoading: (authLoading) =>
          set((state) => ({
            auth: { ...state.auth, authLoading },
          })),

        setUserLoading: (userLoading) =>
          set((state) => ({
            auth: { ...state.auth, userLoading },
          })),

        reset: () =>
          set((state) => ({
            auth: {
              ...state.auth,
              ...initialAuth,
              authLoading: false,
            },
          })),
      },
    }),
    {
      name: 'xmeta-auth-storage',
      // Persist only the stable identity (user). Partner/application are
      // server-authoritative state that changes (approve, suspend, reject)
      // and MUST be refetched on every app boot — otherwise cached role data
      // can let non-partners render partner-only pages before the fresh
      // /status call completes.
      partialize: (state) => ({
        auth: {
          user: state.auth.user,
        },
      }),
      merge: (persisted, current) => {
        const persistedAuth =
          (persisted as Partial<AuthState> | undefined)?.auth ?? {};
        return {
          ...current,
          auth: {
            ...current.auth,
            ...persistedAuth,
          },
        };
      },
    },
  ),
);

// ---------- Convenience selectors ----------

export const useAuth = () => {
  const isAuthenticated = useAuthStore((s) => s.auth.isAuthenticated);
  const accessToken = useAuthStore((s) => s.auth.accessToken);
  const loading = useAuthStore((s) => s.auth.authLoading);

  return {
    isAuthenticated,
    accessToken,
    loading,
    login: () =>
      import('./auth-actions').then(({ refreshAuth }) => refreshAuth(true)),
    refresh: () =>
      import('./auth-actions').then(({ refreshAuth }) => refreshAuth(true)),
  };
};

export const usePartner = () => {
  const partner = useAuthStore((s) => s.auth.partner);
  const userLoading = useAuthStore((s) => s.auth.userLoading);
  const authLoading = useAuthStore((s) => s.auth.authLoading);
  const isAuthenticated = useAuthStore((s) => s.auth.isAuthenticated);

  return {
    partner,
    loading: authLoading || userLoading || (isAuthenticated && !partner),
    refreshProfile: () =>
      import('./auth-actions').then(({ loadUserProfile }) =>
        loadUserProfile(),
      ),
  };
};

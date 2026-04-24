import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { UserData } from '#/services/apis/account/auth';

/**
 * Auth store — Zustand-based, persisted, single source of truth.
 *
 * Replaces the old AuthContext + UserContext pattern.
 *
 * Usage:
 *   // Read (with selective subscription):
 *   const user = useAuthStore((s) => s.auth.userData)
 *   const isAuthenticated = useAuthStore((s) => s.auth.isAuthenticated)
 *
 *   // Mutate:
 *   useAuthStore.getState().auth.setAccessToken(token)
 *   useAuthStore.getState().auth.reset()
 */

interface AuthSlice {
  accessToken: string;
  idToken: string;
  userData: UserData | undefined;
  authLoading: boolean;
  userLoading: boolean;
  isAuthenticated: boolean;

  setAccessToken: (token: string) => void;
  setIdToken: (token: string) => void;
  setUserData: (userData: UserData | undefined) => void;
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
  userData: undefined,
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

        setUserData: (userData) =>
          set((state) => ({
            auth: { ...state.auth, userData },
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
      // Only persist non-sensitive user data — tokens come from Cognito
      partialize: (state) => ({
        auth: {
          userData: state.auth.userData,
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
//
// These mirror the API of the legacy AuthContext / UserContext so consumers
// can read auth state without subscribing to the entire store.
//
// `refresh` / `refreshProfile` are imported lazily inside the hook to avoid a
// circular import with `auth-actions.ts` (which imports this store).

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

export const useUser = () => {
  const userData = useAuthStore((s) => s.auth.userData);
  const userLoading = useAuthStore((s) => s.auth.userLoading);
  const authLoading = useAuthStore((s) => s.auth.authLoading);
  const isAuthenticated = useAuthStore((s) => s.auth.isAuthenticated);

  return {
    userData,
    loading: authLoading || userLoading || (isAuthenticated && !userData),
    refreshProfile: () =>
      import('./auth-actions').then(({ loadUserProfile }) => loadUserProfile()),
  };
};

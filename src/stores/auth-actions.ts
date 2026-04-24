import '#/lib/amplify';
import { fetchAuthSession } from 'aws-amplify/auth';

import { getAuthStatus } from '#/services/apis/partner/profile';

import { useAuthStore } from './auth-store';

/**
 * Refresh Cognito tokens and sync with the auth store.
 */
export async function refreshAuth(forceRefresh = false) {
  const { setAccessToken, setIdToken, setAuthLoading } =
    useAuthStore.getState().auth;

  try {
    const session = await fetchAuthSession({ forceRefresh });
    if (session.tokens) {
      setAccessToken(session.tokens.accessToken?.toString() ?? '');
      setIdToken(session.tokens.idToken?.toString() ?? '');
    } else {
      setAccessToken('');
      setIdToken('');
    }
  } catch {
    setAccessToken('');
    setIdToken('');
  } finally {
    setAuthLoading(false);
  }
}

/**
 * Fetch the onboarding snapshot ({user, partner, application}) and write
 * it into the auth store. This drives which screen the authenticated user
 * sees (dashboard / apply / pending / suspended).
 */
export async function loadUserProfile() {
  const { isAuthenticated, setUser, setPartner, setApplication, setUserLoading } =
    useAuthStore.getState().auth;

  if (!isAuthenticated) {
    setUser(undefined);
    setPartner(undefined);
    setApplication(undefined);
    return;
  }

  setUserLoading(true);
  try {
    const status = await getAuthStatus();
    setUser(status?.user ?? undefined);
    setPartner(status?.partner ?? undefined);
    setApplication(status?.application ?? undefined);
  } catch {
    // API layer handles 401 → redirect to sign-in; 403 surfaces to caller.
  } finally {
    setUserLoading(false);
  }
}

/**
 * Sign the user out — clears Zustand, Amplify session, and sends the user
 * back to the public landing page so the sidebar/dashboard chrome unloads.
 *
 * @param destination — override the post-logout path (e.g. '/login').
 */
export async function signOutAndReset(destination = '/') {
  const { reset } = useAuthStore.getState().auth;
  reset();
  try {
    const { signOut } = await import('aws-amplify/auth');
    await signOut();
  } catch {
    // ignore
  }
  if (typeof window !== 'undefined') {
    const locale = window.location.pathname.split('/')[1] || 'mn';
    window.location.href = `/${locale}${destination}`;
  }
}

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
  const {
    isAuthenticated,
    setUser,
    setPartner,
    setApplication,
    setUserLoading,
    setUserLoaded,
  } = useAuthStore.getState().auth;

  if (!isAuthenticated) {
    setUser(undefined);
    setPartner(undefined);
    setApplication(undefined);
    setUserLoaded(true);
    return;
  }

  setUserLoading(true);
  try {
    const status = await getAuthStatus();
    setUser(status?.user ?? undefined);
    setPartner(status?.partner ?? undefined);
    setApplication(status?.application ?? undefined);
  } catch (err) {
    // 401 is handled by the axios interceptor (refresh + redirect). Anything
    // else is a real failure — log it so it doesn't masquerade as "user is
    // not a partner" when really the backend is down or returning 5xx.
    if (typeof window !== 'undefined') {
      console.error('[auth] /status failed', err);
    }
  } finally {
    // Always release the dashboard gate — a failed /status should surface
    // the resulting state (e.g. NotPartnerCard) rather than spin forever.
    setUserLoaded(true);
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

import '#/lib/amplify';
import { fetchAuthSession } from 'aws-amplify/auth';

import { api } from '#/config/api';
import { apiServices } from '#/services/api/security/api-services';

import { useAuthStore } from './auth-store';
import type { UserData, UserProfileResponse } from '../services';

/**
 * Refresh Cognito tokens and sync with the auth store.
 * Replaces the old `refresh()` function from AuthContext.
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
    // Silently fail — user is simply not logged in
    setAccessToken('');
    setIdToken('');
  } finally {
    setAuthLoading(false);
  }
}

/**
 * Load the authenticated user's profile from the backend.
 * Replaces the old `refreshProfile()` function from UserContext.
 */
export async function loadUserProfile() {
  const { isAuthenticated, setUserData, setUserLoading } =
    useAuthStore.getState().auth;

  if (!isAuthenticated) {
    setUserData(undefined);
    return;
  }

  setUserLoading(true);
  try {
    const data = await apiServices<UserProfileResponse>(
      `${api.v3.account}/api/account/v3/accounts/user/account-info`,
      'GET',
    );

    const newUserData: UserData = {
      user: data?.data?.user,
      preferences: data?.data?.preferences,
    };
    setUserData(newUserData);

    // Sync theme from backend preferences
    const backendTheme = newUserData.preferences?.theme;
    if (
      typeof window !== 'undefined' &&
      (backendTheme === 'light' || backendTheme === 'dark')
    ) {
      const currentTheme = window.localStorage.getItem('x-meta-theme');
      if (currentTheme !== backendTheme) {
        window.localStorage.setItem('x-meta-theme', backendTheme);
        window.dispatchEvent(new Event('storage-theme'));
      }
    }
  } catch {
    // Handled by API layer (redirects to sign-in on 401)
  } finally {
    setUserLoading(false);
  }
}

/**
 * Sign the user out — resets store and Amplify session.
 */
export async function signOutAndReset() {
  const { reset } = useAuthStore.getState().auth;
  reset();
  try {
    const { signOut } = await import('aws-amplify/auth');
    await signOut();
  } catch {
    // ignore
  }
}

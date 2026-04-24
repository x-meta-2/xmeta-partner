/**
 * BaseService — single axios instance for all partner-api calls.
 *
 * Auth/401 handling lives here; feature services build URLs with
 * `api.partner.*` prefixes and call baseService.get/post/put/delete directly.
 *
 * Usage:
 *   import baseService from '#/services/base-service';
 *   const { data } = await baseService.get(`${api.partner.dashboard}/summary`);
 */

import { api } from '#/config/api';
import { useAuthStore } from '#/stores/auth-store';
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const baseService: AxiosInstance = axios.create({
  baseURL: api.partner.base,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get a valid Cognito idToken. Returns the cached token from the auth store
 * when present; otherwise fetches a fresh session from Amplify and caches it.
 *
 * On hard refresh, the auth store has no token until `refreshAuth()` runs.
 * This guarantees the very first request still ships with a Bearer header.
 */
async function getIdToken(forceRefresh = false): Promise<string | undefined> {
  const cached = useAuthStore.getState().auth.idToken;
  if (cached && !forceRefresh) return cached;

  try {
    const session = await fetchAuthSession({ forceRefresh });
    const idToken = session.tokens?.idToken?.toString();
    const accessToken = session.tokens?.accessToken?.toString();
    if (idToken) {
      const auth = useAuthStore.getState().auth;
      auth.setIdToken(idToken);
      if (accessToken) auth.setAccessToken(accessToken);
      return idToken;
    }
  } catch {
    // No active Cognito session — caller will handle the resulting 401.
  }
  return undefined;
}

// Request interceptor — guarantee a Bearer token if the user has any session
baseService.interceptors.request.use(
  async (config) => {
    const token = await getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — refresh + retry once on 401, then sign out
baseService.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const config = error.config as RetryConfig | undefined;

    if (status !== 401 || !config || config._retry) {
      throw error;
    }

    const isAuthRequest = config.url?.includes('/auth/');
    if (isAuthRequest) {
      throw error;
    }

    config._retry = true;

    // Try a forced token refresh first — token may have just expired.
    const fresh = await getIdToken(true);
    if (fresh) {
      config.headers.set('Authorization', `Bearer ${fresh}`);
      return baseService.request(config);
    }

    // No session at all — sign out and bounce to login.
    // signOutAndReset handles the navigation itself.
    if (typeof globalThis !== 'undefined') {
      const { signOutAndReset } = await import('#/stores/auth-actions');
      await signOutAndReset('/login');
    }

    throw error;
  },
);

export default baseService;

/**
 * Legacy fetch-based API client (used by existing feature code).
 *
 * New code should prefer the Axios-based clients from `@/services`:
 *   import { apiClient, accountClient } from '@/services'
 *
 * This file is kept for backwards compatibility while features are migrated.
 *
 * Key improvements over the previous implementation:
 *
 *  1. Token caching — `refreshTokens()` is no longer called on every request.
 *     Tokens are cached in-memory and only refreshed when:
 *       - Cache is empty (first request)
 *       - Cache is older than 50 minutes (Cognito tokens expire at 60m)
 *       - Caller explicitly passes `forceRefreshToken: true`
 *       - Response is 401 (invalid/expired token, refresh then retry once)
 *
 *  2. In-flight deduplication — if multiple requests happen simultaneously
 *     while a refresh is in progress, they all wait for the SAME refresh
 *     promise instead of each triggering their own refresh (N+1 storm).
 *
 *  3. Retry cap — a request can only retry on 401 once. If the retried
 *     request also fails with 401, the error is propagated instead of
 *     looping forever.
 */
import { api } from '#/config/api';
import { refreshTokens } from '#/lib/amplify';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export class ApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

interface ApiServiceOptions {
  baseURL?: string;
  timeout?: number;
  params?: QueryParams;
  forceRefreshToken?: boolean;
}

// ---------- Token cache (module-level singleton) ----------

interface CachedToken {
  tokenId: string;
  accessToken: string;
  fetchedAt: number;
}

let cachedToken: CachedToken | null = null;
let refreshInFlight: Promise<CachedToken | null> | null = null;

/**
 * Cognito tokens expire after 60 minutes. Refresh at 50m to avoid hitting
 * expiry during an in-flight request.
 */
const TOKEN_MAX_AGE_MS = 50 * 60 * 1000;

function isCacheValid(): boolean {
  if (!cachedToken) return false;
  return Date.now() - cachedToken.fetchedAt < TOKEN_MAX_AGE_MS;
}

/**
 * Get a valid token, using cache when possible and deduplicating
 * concurrent refresh calls.
 */
async function getToken(forceRefresh: boolean): Promise<CachedToken | null> {
  if (!forceRefresh && isCacheValid()) {
    return cachedToken;
  }

  // If a refresh is already in flight, wait for it instead of starting another.
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    try {
      const data = await refreshTokens({ forceRefresh });
      if (data) {
        cachedToken = {
          tokenId: data.tokenId,
          accessToken: data.accessToken,
          fetchedAt: Date.now(),
        };
        return cachedToken;
      }
      cachedToken = null;
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

/**
 * Clear the cached token. Call this on logout.
 */
export function clearApiTokenCache(): void {
  cachedToken = null;
  refreshInFlight = null;
}

// ---------- Main API function ----------

export async function apiServices<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  method: HttpMethod,
  body?: TBody,
  options: ApiServiceOptions = {},
): Promise<TResponse> {
  const {
    baseURL = typeof globalThis !== 'undefined' &&
    (globalThis.location.hostname === 'localhost' ||
      globalThis.location.hostname === '127.0.0.1')
      ? globalThis.location.origin
      : import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout = 10000,
    params,
    forceRefreshToken = false,
  } = options;

  const url = new URL(endpoint, baseURL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Use cached token unless explicitly forced
  const tokenData = await getToken(forceRefreshToken);
  const token = tokenData?.tokenId ?? '';

  const headers: Record<string, string> = { 'x-api-key': api.key ?? '' };
  if (token) headers.Authorization = `Bearer ${token}`;

  if (!(body instanceof FormData) && body != null) {
    headers['Content-Type'] = 'application/json';
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body:
        method === 'GET'
          ? undefined
          : body instanceof FormData
            ? body
            : body != null
              ? JSON.stringify(body)
              : undefined,
      signal: controller.signal,
    });

    let data: unknown;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // On 401, invalidate cache and retry once with a fresh token.
    // `forceRefreshToken` prevents infinite loops.
    if (response.status === 401 && !forceRefreshToken) {
      cachedToken = null;
      return apiServices<TResponse, TBody>(endpoint, method, body, {
        ...options,
        forceRefreshToken: true,
      });
    }

    if (!response.ok) {
      const errData = data as { message?: string } | undefined;
      throw new ApiError(
        errData?.message ?? response.statusText ?? 'Request failed',
        response.status,
        data,
      );
    }

    return data as TResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    if (error instanceof TypeError) {
      throw new ApiError('Network error', 0);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

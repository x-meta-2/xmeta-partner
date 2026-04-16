/**
 * HTTP API Client — Axios-based factory pattern.
 *
 * Creates typed axios instances with auth + error interceptors applied once,
 * instead of duplicating the logic per client.
 *
 * Usage:
 *   import { apiClient, securityClient, stakingClient } from '#/services/api/client'
 *   const { data } = await apiClient.get<UserProfile>('/user/profile')
 */
import axios from 'axios'
import type {AxiosError, AxiosInstance} from 'axios';

import { api } from '#/config/api'
import { useAuthStore } from '#/stores/auth-store'

interface CreateClientOptions {
  baseURL: string
  withAuth?: boolean
  withApiKey?: boolean
}

/**
 * Factory function for creating a configured axios instance.
 * All clients share the same interceptor logic — no duplication.
 */
function createClient({
  baseURL,
  withAuth = true,
  withApiKey = false,
}: CreateClientOptions): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: 30_000,
    headers: {
      'Content-Type': 'application/json',
      ...(withApiKey ? { 'x-api-key': api.key } : {}),
    },
  })

  // Request interceptor — inject Bearer token
  client.interceptors.request.use(
    (config) => {
      if (withAuth) {
        const token = useAuthStore.getState().auth.accessToken
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // Response interceptor — handle auth errors centrally
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        const isAuthRequest = error.config?.url?.includes('/auth/')
        if (!isAuthRequest && typeof window !== 'undefined') {
          const { signOutAndReset } = await import('#/stores/auth-actions')
          await signOutAndReset()
          window.location.href = '/auth/login'
        }
      }
      return Promise.reject(error)
    },
  )

  return client
}

// ---------- Pre-configured client instances ----------

/** Partner API — primary client for all partner endpoints */
export const partnerClient = createClient({
  baseURL: api.partner.base,
})

/** Main X-Meta API v3 — TEMPORARY shim during migration */
export const apiClient = createClient({
  baseURL: api.v3.base,
})

/** Account API — profile, preferences */
export const accountClient = createClient({
  baseURL: api.v3.account,
})

/** Security API — MFA, verification codes, password changes */
export const securityClient = createClient({
  baseURL: api.v3.security,
})

/** Staking API */
export const stakingClient = createClient({
  baseURL: api.v3.staking,
})

/** Take-action API */
export const takeActionClient = createClient({
  baseURL: api.v3.takeAction,
})

/** Public config API (no auth required) */
export const configClient = createClient({
  baseURL: api.v3.config,
  withAuth: false,
})

/** Legacy Open API v1 — older endpoints */
export const legacyClient = createClient({
  baseURL: api.xmeta.open,
  withApiKey: true,
})

// ---------- Error type ----------

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

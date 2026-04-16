/**
 * Auth domain service — new Axios-based pattern.
 *
 * Reference implementation for the service layer migration.
 * New services should follow this structure:
 *   - One file per domain
 *   - Typed request/response signatures
 *   - Use pre-configured axios client from `./client`
 *   - Export a single service object
 */
import type { AxiosError } from 'axios'

import { refreshTokens } from '#/lib/amplify'
import type { BaseResponse } from '#/services/types/common.types'
import type { UserData, UserProfileResponse } from '#/services/types/user.types'
import {
  verificationEmailPost,
  verificationSmsPost,
  type VerificationCodeRequest,
} from '#/services/api/security/verification-code'

import { accountClient, apiClient } from './client'
import { apiServices } from './security/api-services'

export { refreshTokens }

// ---------- Request/Response Types ----------

export interface LoginRequest {
  email: string
  password: string
  captchaResponse?: string
}

export interface LoginResponse {
  idToken?: string
  accessToken?: string
  requiresMFA?: boolean
  mfaType?: 'SMS' | 'TOTP'
  session?: string
}

export interface ConfirmMFARequest {
  email: string
  code: string
  session: string
}

export interface ChangePasswordRequest {
  old_password: string
  password: string
}

export interface ChangePasswordResponse {
  code: number
  msg?: string
}

// ---------- Pure helpers (no React deps) ----------

export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<ChangePasswordResponse | undefined> => {
  try {
    return await apiServices<ChangePasswordResponse>(
      'https://www.x-meta.com/api/user/changepass',
      'GET',
      undefined,
      {
        params: { old: data.old_password, new: data.password },
      },
    )
  } catch (err) {
    console.error('changePassword error:', err)
    return undefined
  }
}

export const requestSmsCode = async (
  name: string,
  phone = '',
  captcha = '',
): Promise<string> => {
  const body: VerificationCodeRequest = { verification_name: name }
  if (phone) body.phone_number = phone
  body.captcha = captcha

  const res = await verificationSmsPost(body)
  if (res.code === 0) return res.data.verificationId ?? ''
  throw new Error(res.msg ?? 'Failed to request SMS code')
}

export const requestEmailCode = async (
  name: string,
  opts: {
    asset?: string
    address?: string
    amount?: string
    duration?: string
  } = {},
): Promise<string> => {
  const body: VerificationCodeRequest = { verification_name: name }
  if (opts.asset) {
    body.address = String(opts.address ?? '')
    body.amount = String(opts.amount ?? '')
    body.asset = String(opts.asset)
    body.duration = String(opts.duration ?? '')
  }

  const res = await verificationEmailPost(body)
  if (res.code === 0) return res.data.verificationId ?? ''
  throw new Error(res.msg ?? 'Failed to request email code')
}

// ---------- Service Object ----------

export const authService = {
  /**
   * Fetch the authenticated user's account info & preferences.
   * Replaces the old `apiServices` call in UserContext.
   */
  getUserInfo: async (): Promise<UserData> => {
    const { data } = await accountClient.get<UserProfileResponse>(
      '/api/account/v3/accounts/user/account-info',
    )
    return {
      user: data.data.user,
      preferences: data.data.preferences,
    }
  },

  /**
   * Logout — invalidates the backend session.
   * Note: Amplify signOut should also be called separately to clear Cognito state.
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post<BaseResponse<null>>('/auth/logout')
    } catch (error) {
      const axiosError = error as AxiosError
      // Swallow logout errors — we always want to clear local state
      if (axiosError.response?.status !== 401) {
         
        console.warn('Logout API failed, continuing local cleanup', error)
      }
    }
  },
}

export type AuthService = typeof authService

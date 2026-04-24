import type { AxiosError } from 'axios';
import { updatePassword } from 'aws-amplify/auth';

import { api } from '#/config/api';
import { refreshTokens } from '#/lib/amplify';
import baseService from '#/services/base-service';
import {
  verificationEmailPost,
  verificationSmsPost,
  type VerificationCodeRequest,
} from '#/services/apis/security/verification-code';
import type { BaseResponse } from '#/services/types';
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  UserData,
  UserProfileResponse,
} from './types';

export { refreshTokens };
export { LoginNextStepType } from './types';
export type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ConfirmMFARequest,
  LoginRequest,
  LoginResponse,
  UserData,
  UserProfileResponse,
} from './types';

export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<ChangePasswordResponse | undefined> => {
  try {
    await updatePassword({
      oldPassword: data.old_password,
      newPassword: data.password,
    });
    return { code: 0 };
  } catch (err) {
    console.error('changePassword error:', err);
    return {
      code: 1,
      msg: err instanceof Error ? err.message : 'Unknown error',
    };
  }
};

export const requestSmsCode = async (
  name: string,
  phone = '',
  captcha = '',
): Promise<string> => {
  const body: VerificationCodeRequest = { verification_name: name };
  if (phone) body.phone_number = phone;
  body.captcha = captcha;

  const res = await verificationSmsPost(body);
  if (res.code === 0) return res.data.verificationId ?? '';
  throw new Error(res.msg ?? 'Failed to request SMS code');
};

export const requestEmailCode = async (
  name: string,
  opts: {
    asset?: string;
    address?: string;
    amount?: string;
    duration?: string;
  } = {},
): Promise<string> => {
  const body: VerificationCodeRequest = { verification_name: name };
  if (opts.asset) {
    body.address = String(opts.address ?? '');
    body.amount = String(opts.amount ?? '');
    body.asset = String(opts.asset);
    body.duration = String(opts.duration ?? '');
  }

  const res = await verificationEmailPost(body);
  if (res.code === 0) return res.data.verificationId ?? '';
  throw new Error(res.msg ?? 'Failed to request email code');
};

/** Fetch the authenticated user's account info & preferences. */
export const getUserInfoApi = async (): Promise<UserData> => {
  const { data } = await baseService.get<UserProfileResponse>(
    `${api.partner.auth}/info`,
  );
  return {
    user: data.data.user,
    preferences: data.data.preferences,
  };
};

/** Backend logout — invalidates the session server-side. */
export const logoutApi = async (): Promise<void> => {
  try {
    await baseService.post<BaseResponse<null>>(`${api.partner.auth}/logout`);
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status !== 401) {
      console.warn('Logout API failed, continuing local cleanup', error);
    }
  }
};

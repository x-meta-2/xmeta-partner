import { api } from '#/config/api';
import baseService from '#/services/base-service';

import type { VerificationCodeRequest, VerificationCodeResponse } from './types';

export type {
  VerificationCodeRequest,
  VerificationCodeResponse,
} from './types';

export const verificationEmailPost = async (
  body: VerificationCodeRequest,
): Promise<VerificationCodeResponse> => {
  const { data: response } = await baseService.post<VerificationCodeResponse>(
    `${api.partner.auth}/verification-code/email`,
    body,
  );
  return response;
};

export const verificationSmsPost = async (
  body: VerificationCodeRequest,
): Promise<VerificationCodeResponse> => {
  const { data: response } = await baseService.post<VerificationCodeResponse>(
    `${api.partner.auth}/verification-code/sms`,
    body,
  );
  return response;
};

/** Higher-level helper: request SMS code, return verificationId. */
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

/** Higher-level helper: request email code, return verificationId. */
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

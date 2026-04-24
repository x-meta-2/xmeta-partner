import { api } from '#/config/api';
import baseService from '#/services/base-service';
import type {
  VerificationCodeRequest,
  VerificationCodeResponse,
} from './types';

export type { VerificationCodeRequest, VerificationCodeResponse } from './types';

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

import { api } from '#/config/api';
import { apiServices } from '../api-services';

export interface VerificationCodeRequest {
  verification_name: string;
  phone_number?: string;
  captcha?: string;
  asset?: string;
  address?: string;
  amount?: string;
  duration?: string;
}

export interface VerificationCodeResponse {
  code: number;
  msg: string;
  data: {
    verificationId?: string;
    deliveryMethod?: string;
    remaining?: number;
  };
}

export const verificationEmailPost = async (
  body: VerificationCodeRequest,
): Promise<VerificationCodeResponse> => {
  const response = await apiServices<VerificationCodeResponse>(
    `${api.v3.security}/verification-code/email`,
    'POST',
    body,
  );
  return response;
};

export const verificationSmsPost = async (
  body: VerificationCodeRequest,
): Promise<VerificationCodeResponse> => {
  const response = await apiServices<VerificationCodeResponse>(
    `${api.v3.security}/verification-code/sms`,
    'POST',
    body,
  );
  return response;
};

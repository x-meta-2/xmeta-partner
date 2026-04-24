import { api } from '#/config/api';
import baseService from '#/services/base-service';
import type { BaseResponse } from '#/services/types';
import type {
  QrLoginCheckRequest,
  QrLoginCheckResponse,
  QrLoginRequestResponse,
} from './types';

export type {
  AuthTokens,
  EmailVerification,
  PostMfaResponse,
  QrLoginCheckRequest,
  QrLoginCheckResponse,
  QrLoginRequestResponse,
  QrLoginSessionData,
  SecurityInfoType,
  SecurityRequest,
  SecurityResponse,
  SmsVerification,
  TokenVerification,
} from './types';

export const qrLoginRequestApi = async () => {
  const { data: response } = await baseService.post<
    BaseResponse<QrLoginRequestResponse>
  >(`${api.partner.auth}/qr-login/request`, {});
  return response;
};

export const qrLoginCheckApi = async (body: QrLoginCheckRequest) => {
  const { data: response } = await baseService.post<
    BaseResponse<QrLoginCheckResponse>
  >(`${api.partner.auth}/qr-login/check`, body);
  return response;
};

import { api } from '#/config/api';
import { apiServices } from '../api-services';
import type {
  QrLoginCheckRequest,
  QrLoginCheckResponse,
  QrLoginRequestResponse,
} from '#/services/types/security.types';
import type { ApiResponse } from '#/services/types/common.types';

export const qrLoginRequestApi = async () => {
  const response: ApiResponse<QrLoginRequestResponse> | undefined =
    await apiServices(
      `${api.v3.security}/auth/qr-login/request`,
      'POST',
      {},
    );
  return response;
};

export const qrLoginCheckApi = async (body: QrLoginCheckRequest) => {
  const response: ApiResponse<QrLoginCheckResponse> | undefined =
    await apiServices(
      `${api.v3.security}/auth/qr-login/check`,
      'POST',
      body,
    );
  return response;
};

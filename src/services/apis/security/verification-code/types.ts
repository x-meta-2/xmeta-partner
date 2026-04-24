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

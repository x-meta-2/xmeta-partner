export interface QrLoginRequestResponse {
  session: string;
}

export interface QrLoginCheckResponse {
  userId: string;
  isLogin: boolean;
}

export interface QrLoginSessionData {
  id: string;
  createdTime: number;
  expTime: number;
  device: string;
  nonce: string;
}

export interface QrLoginCheckRequest {
  sessionId: string;
  nonce: string;
}

export interface AuthTokens {
  idToken: string;
  isLogin: boolean;
}

export interface SmsVerification {
  verification_id: string;
  code: string;
}

export interface EmailVerification {
  verification_id: string;
  code: string;
}

export interface TokenVerification {
  code: string;
}

export interface SecurityRequest {
  verification_name: string;
  request_type: string;
  verification: {
    SMS?: SmsVerification;
    TOKEN?: TokenVerification;
    EMAIL?: EmailVerification;
  };
  secret?: string;
  phone?: string;
}

export type SecurityResponse = {
  code: number;
  msg: string;
  data: SecurityInfoType;
};

export type SecurityInfoType = {
  mfa: {
    tokenMfa: {
      status: number;
    };
    smsMfa: {
      status: number;
      phoneNumberMasked: string;
    };
  };
  whiteList: {
    status: number;
  };
  antiPhishing: {
    status: number;
    codeMasked: string;
  };
  withdrawBan: {
    uid: string;
    banned: number;
  };
};

export type PostMfaResponse = {
  code: number;
  msg: string;
  data: {};
};

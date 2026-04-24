export enum LoginNextStepType {
  DONE = 'DONE',
  CONFIRM_SIGN_IN_WITH_SMS_CODE = 'CONFIRM_SIGN_IN_WITH_SMS_CODE',
  CONFIRM_SIGN_IN_WITH_TOTP_CODE = 'CONFIRM_SIGN_IN_WITH_TOTP_CODE',
  CONTINUE_SIGN_IN_WITH_MFA_SELECTION = 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION',
  CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED = 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED',
}

export interface LoginRequest {
  email: string;
  password: string;
  captchaResponse?: string;
}

export interface LoginResponse {
  idToken?: string;
  accessToken?: string;
  requiresMFA?: boolean;
  mfaType?: 'SMS' | 'TOTP';
  session?: string;
}

export interface ConfirmMFARequest {
  email: string;
  code: string;
  session: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  password: string;
}

export interface ChangePasswordResponse {
  code: number;
  msg?: string;
}

export type UserProfileResponse = {
  code: number;
  msg: string;
  data: UserData;
};

export type UserData = {
  user: {
    uid: string;
    nick: string;
    avatar: string;
    email: string;
    status: number;
    kycLevel: number;
    vipLevel: number;
    canTrade: number;
    canWithdraw: number;
    futuresTrade: number;
    isCompany: number;
    companyName: string;
    companyType: string;
  };
  preferences: {
    language: string;
    theme: string;
    timezone: string;
    currency: string;
    createdTime: number;
    updatedTime: number;
  };
};

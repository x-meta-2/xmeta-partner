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

import { Amplify } from 'aws-amplify';
import { fetchAuthSession, updatePassword } from 'aws-amplify/auth';

import { env } from '#/config/env';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: env.VITE_COGNITO_USER_POOL_ID,
      identityPoolId: '',
      userPoolClientId: env.VITE_COGNITO_CLIENT_ID,
    },
  },
});

export interface ChangePasswordRequest {
  old_password: string;
  password: string;
}

export interface ChangePasswordResponse {
  code: number;
  msg?: string;
}

/**
 * Thin wrapper around `fetchAuthSession` returning the tokens we care about.
 */
export const refreshTokens = async ({
  forceRefresh = false,
}: {
  forceRefresh?: boolean;
} = {}) => {
  try {
    const session = await fetchAuthSession({ forceRefresh });
    if (session.tokens) {
      return {
        tokenId: session.tokens.idToken
          ? session.tokens.idToken.toString()
          : '',
        accessToken: session.tokens.accessToken.toString(),
      };
    }
    return null;
  } catch (error) {
    console.error('refreshTokens error:', error);
    return null;
  }
};

/**
 * Change the authenticated user's password via Cognito.
 */
export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<ChangePasswordResponse> => {
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

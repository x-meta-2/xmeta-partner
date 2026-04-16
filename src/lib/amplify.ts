import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';

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

/**
 * Thin wrapper around `fetchAuthSession` returning the tokens we care about.
 *
 * Lives here (rather than in `auth.service.ts`) to avoid a circular import
 * between `api-services` and `auth.service` — both of those depend on this.
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

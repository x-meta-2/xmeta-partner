import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoUserPool } from "amazon-cognito-identity-js";

const UserPool = {
  UserPoolId: import.meta.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID,
};

export const cognitoidentityserviceprovider = new CognitoIdentityProviderClient(
  {
    region: import.meta.env.NEXT_PUBLIC_COGNITO_REGION,
  }
);

export default new CognitoUserPool(UserPool);

import { confirmSignIn, signIn, signOut } from 'aws-amplify/auth';
import type { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

import { useLocalizedNavigate } from '#/hooks/use-localized-navigate';
import { usePostAuthNavigation } from '#/hooks/use-post-auth-navigation';
import {
  changePassword as changePasswordApi,
  type ChangePasswordRequest,
  type ChangePasswordResponse,
} from '#/lib/amplify';
import { LoginNextStepType, type LoginRequest } from '#/lib/auth-types';
import {
  requestEmailCode,
  requestSmsCode,
} from '#/services/apis/security/verification-code';
import { refreshAuth } from '#/stores/auth-actions';
import { getErrorMessage } from '#/utils/get-error-message';

/**
 * Authentication action hook.
 *
 * Wraps Cognito sign-in/sign-out flows together with the navigation side
 * effects that follow each step. Pure API calls live in `auth.service.ts` —
 * this hook only contains logic that depends on React (router navigate,
 * post-auth redirect resolution).
 */
export function useAuthActions() {
  const navigate = useLocalizedNavigate();
  const goToPostLoginDestination = usePostAuthNavigation();

  const refresh = () => refreshAuth(true);

  const confirmMFA = async (challengeResponse: string) => {
    await confirmSignIn({ challengeResponse });
    await refresh();
    await goToPostLoginDestination();
  };

  const confirmSMS = async (sms: string) => {
    try {
      await confirmMFA(sms);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const confirm2FA = async (code: string) => {
    try {
      await confirmMFA(code);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const logout = async () => {
    await signOut();
    await refresh();
  };

  const login = async (
    values: LoginRequest,
    { captcha }: { captcha: string },
  ) => {
    await signOut();
    try {
      const res = await signIn({
        username: values.email,
        password: values.password,
        options: {
          clientMetadata: {
            captchaResponse: captcha,
            captchaClient: 'web',
          },
        },
      });

      if (res.isSignedIn) {
        localStorage.setItem('email', values.email);
        await refresh();
        await goToPostLoginDestination();
        return;
      }

      sessionStorage.setItem('email', values.email);

      switch (res.nextStep.signInStep) {
        case LoginNextStepType.CONFIRM_SIGN_IN_WITH_SMS_CODE:
          await navigate('/sms-mfa');
          break;
        case LoginNextStepType.CONTINUE_SIGN_IN_WITH_MFA_SELECTION:
          await navigate('/select-mfa-type');
          break;
        case LoginNextStepType.CONFIRM_SIGN_IN_WITH_TOTP_CODE:
          await navigate('/software-token-mfa');
          break;
        case LoginNextStepType.CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED:
          await navigate('/new-password-required');
          break;
        default:
          toast.error(`Unhandled sign-in step: ${res.nextStep.signInStep}`);
          break;
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const changePassword = async (
    data: ChangePasswordRequest,
    { setSubmitting }: { setSubmitting: Dispatch<SetStateAction<boolean>> },
  ): Promise<ChangePasswordResponse | undefined> => {
    try {
      return await changePasswordApi(data);
    } finally {
      setSubmitting(false);
    }
  };

  const getSMSCode = async (name: string, phone = '', captcha = '') => {
    try {
      return await requestSmsCode(name, phone, captcha);
    } catch (err) {
      toast.error(getErrorMessage(err));
      return '';
    }
  };

  const getEmailCode = async (
    name: string,
    opts: {
      asset?: string;
      address?: string;
      amount?: string;
      duration?: string;
    } = {},
  ) => {
    try {
      return await requestEmailCode(name, opts);
    } catch (err) {
      toast.error(getErrorMessage(err));
      return '';
    }
  };

  return {
    login,
    logout,
    confirmSMS,
    confirm2FA,
    getSMSCode,
    getEmailCode,
    changePassword,
  };
}

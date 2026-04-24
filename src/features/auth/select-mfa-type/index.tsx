import * as React from 'react';
import { Button } from '#/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field';
import { Separator } from '#/components/ui/separator';
import { useI18n } from '#/i18n/context';
import { useForm } from '@tanstack/react-form';
import { confirmSignIn } from 'aws-amplify/auth';
import { toast } from 'sonner';
import { useAuthActions } from '#/hooks/use-auth-actions.ts';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '#/components/ui/input-otp';
import { getErrorMessage } from '#/utils/get-error-message';
import { LoginNextStepType } from '#/services/apis/account/auth';
import { AuthCarousel } from '../components/auth-carousel';
import { useLocalizedNavigate } from '#/hooks/use-localized-navigate';

export const SelectMfaTypePage = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useI18n();
  const { confirm2FA } = useAuthActions();
  const [isMfaSelected, setIsMfaSelected] = React.useState(false);

  const form = useForm({
    defaultValues: {
      token: '',
    },
    onSubmit: async ({ value }) => {
      try {
        if (!isMfaSelected) {
          const res = await confirmSignIn({
            challengeResponse: 'TOTP',
          });

          if (
            res.nextStep.signInStep ===
            LoginNextStepType.CONFIRM_SIGN_IN_WITH_TOTP_CODE
          ) {
            setIsMfaSelected(true);
          } else {
            toast.error('Unexpected step: ' + res.nextStep.signInStep);
            return;
          }
        }
        await confirm2FA(value.token);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    },
  });

  const handleSwitchToSms = async () => {
    try {
      const res = await confirmSignIn({ challengeResponse: 'SMS' });
      if (
        res.nextStep.signInStep ===
        LoginNextStepType.CONFIRM_SIGN_IN_WITH_SMS_CODE
      ) {
        await void navigate('/sms-mfa');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="flex">
      <div className="w-2/5 p-3 hidden lg:block">
        <AuthCarousel />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col justify-center mb-14 h-[80vh] max-w-sm mx-auto px-4 sm:px-0">
        <h1 className="text-center text-2xl font-bold mb-3">
          {t('auth:totp-mfa.title', 'Authenticator App')}
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-4">
          {t(
            'auth:totp-mfa.subtitle',
            'Enter the 6-digit code from your authenticator app.',
          )}
        </p>
        <div className="flex items-center justify-center border border-border rounded-full p-1.5 mb-6 gap-4">
          <img src="/assets/logo/lock-green.svg" alt="Lock" />
          <span>https://www.x-meta.com</span>
        </div>
        <Separator className="my-4" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="flex flex-col gap-5">
            <form.Field name="token">
              {(field) => (
                <Field className="mb-1">
                  <FieldLabel htmlFor="form-token">
                    {t('auth:totp-mfa.code', 'Authenticator Code')}
                  </FieldLabel>
                  <InputOTP
                    maxLength={6}
                    id="form-token"
                    required
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    onChange={(value) => {
                      field.handleChange(value);
                      if (value.length === 6) {
                        form.handleSubmit();
                      }
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </Field>
              )}
            </form.Field>

            <Field orientation="horizontal">
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    className="w-full py-5.5"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t('auth:sms-mfa.submitting', 'Verifying...')
                      : t('auth:confirm.button')}
                  </Button>
                )}
              </form.Subscribe>
            </Field>

            <div className="flex justify-between items-center mt-2">
              <Button
                variant="link"
                type="button"
                className="p-0 text-sm h-auto font-normal text-muted-foreground hover:text-foreground"
                onClick={handleSwitchToSms}
              >
                {t('auth:mfa-select.switch-to-sms', 'Verify by SMS instead')}
              </Button>

              <Button
                variant="link"
                type="button"
                className="p-0 text-sm h-auto font-normal text-muted-foreground hover:text-foreground"
                onClick={() => void navigate('/login')}
              >
                {t('auth:cancel', 'Cancel')}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};

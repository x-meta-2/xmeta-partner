import { AuthCarousel } from '#/features/auth/components/auth-carousel';
import { Button } from '#/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field';
import { Separator } from '#/components/ui/separator';
import { useI18n } from '#/i18n/context';
import { useForm } from '@tanstack/react-form';
import { useAuthActions } from '#/hooks/use-auth-actions.ts';
import { useLocalizedNavigate } from '#/hooks/use-localized-navigate';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '#/components/ui/input-otp';

export const SoftwareTokenMfaPage = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useI18n();
  const { confirm2FA } = useAuthActions();

  const form = useForm({
    defaultValues: {
      token: '',
    },
    onSubmit: async ({ value }) => {
      await confirm2FA(value.token);
    },
  });

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
            <form.Field
              name="token"
              validators={{
                onBlur: ({ value }) => {
                  if (!value) return 'Verification code is required';
                  if (value.length < 6) return 'Must be at least 6 characters';
                  return undefined;
                },
              }}
            >
              {(field) => (
                <Field>
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
                      : t('auth:login.button')}
                  </Button>
                )}
              </form.Subscribe>
            </Field>

            <div className="flex justify-center mt-2">
              <Button
                variant="ghost"
                type="button"
                className="w-full"
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

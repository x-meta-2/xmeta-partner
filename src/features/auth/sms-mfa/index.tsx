import { Button } from '#/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field';
import { Separator } from '#/components/ui/separator';
import { useI18n } from '#/i18n/context';
import { useForm } from '@tanstack/react-form';
import { useAuthActions } from '#/hooks/use-auth-actions.ts';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '#/components/ui/input-otp';
import { useLocalizedNavigate } from '#/hooks/use-localized-navigate';

export const SmsMfaPage = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useI18n();
  const { confirmSMS } = useAuthActions();

  const form = useForm({
    defaultValues: {
      token: '',
    },
    onSubmit: async ({ value }) => {
      await confirmSMS(value.token);
    },
  });

  return (
    <div className="flex justify-center">
      <div className="w-full flex flex-col justify-center mb-14 h-[80vh] max-w-sm mx-auto px-4 sm:px-0">
        <h1 className="text-center text-2xl font-bold mb-3">
          {t('partner:auth.smsVerification')}
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-4">
          {t('partner:auth.smsDescription')}
        </p>
        <div className="flex items-center justify-center border border-border rounded-full p-1.5 mb-6 gap-4">
          <img src="/assets/logo/lock-green.svg" alt="Lock" />
          <span>https://partners.x-meta.com/</span>
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
                  if (!value) return t('partner:auth.codeRequired');
                  if (value.length < 6) return t('partner:auth.codeMinLength');
                  return undefined;
                },
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="form-token">
                    {t('partner:auth.verificationCode')}
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
                      ? t('partner:auth.verifying')
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
                {t('partner:common.cancel')}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};

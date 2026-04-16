import { AuthCarousel } from '#/features/auth/components/auth-carousel';
import { Button } from '#/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field';
import { Separator } from '#/components/ui/separator';
import { useI18n } from '#/i18n/context';
import { useForm } from '@tanstack/react-form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '#/components/ui/input-otp';
import { useLocalizedNavigate } from '#/hooks/use-localized-navigate';

export const VerifyEmailPage = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useI18n();

  const form = useForm({
    defaultValues: {
      token: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      void navigate('/phone-register');
    },
  });

  return (
    <>
      {/* <Dialog>
        <div className="p-2 w-[318px] h-[93px]  flex items-center justify-center">
          <Turnstile
            sitekey="0x4AAAAAAB6pa_vjK_5VNI8n" // replace with your Cloudflare Turnstile site key
            onVerify={(token) => {
              const captcha = token;
              register(data, { captcha });
            }}
          />
        </div>
      </Dialog> */}

      <div className="flex h-full">
        <div className="w-2/5 p-3 hidden lg:block">
          <AuthCarousel />
        </div>

        <div className="w-full lg:w-3/5 flex flex-col justify-center mb-14 h-[80vh] max-w-sm mx-auto px-4 sm:px-0">
          <h1 className="text-center text-2xl font-bold mb-3">
            {t('auth:verify.email.title')}
          </h1>
          <p className="text-center text-md text-muted-foreground mb-2">
            {t('auth:verify.email.description')} {localStorage.getItem('email')}
          </p>
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
                      {t('auth:totp-mfa.code', 'Email code')}
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
                        ? t('auth:register.submitting', 'Creating account…')
                        : t('auth:continue')}
                    </Button>
                  )}
                </form.Subscribe>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>
    </>
  );
};

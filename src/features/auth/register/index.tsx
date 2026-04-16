import { PasswordAutocomplete } from '#/components/common';

import { Button } from '#/components/ui/button';
import { EmailAutocomplete } from '#/components/ui/email-autocomplete';
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field';
import { Separator } from '#/components/ui/separator';
import { useI18n } from '#/i18n/context';
import { useForm } from '@tanstack/react-form';
import { AuthCarousel } from '../components/auth-carousel';
import { useLocalizedNavigate } from '#/hooks/use-localized-navigate';

export const RegisterPage = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useI18n();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      phone: '',
    },
    onSubmit: async ({ value }) => {
      localStorage.setItem('email', value.email);
      console.log(value);
      void navigate('/verify-email');
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
            {t('auth:register.title')}
          </h1>
          <Separator className="my-4" />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="flex flex-col gap-5">
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="form-email">
                      {t('auth:email')}
                    </FieldLabel>
                    <EmailAutocomplete
                      id="form-email"
                      placeholder="Email"
                      required
                      value={field.state.value}
                      onChange={(val: string) => field.handleChange(val)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-destructive mt-1">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </Field>
                )}
              </form.Field>
              <form.Field
                name="password"
                validators={{
                  onBlur: ({ value }) => {
                    if (!value) return 'Password is required';
                    if (value.length < 8)
                      return 'Must be at least 8 characters';
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="form-password">
                      {t('auth:password')}
                    </FieldLabel>
                    <PasswordAutocomplete
                      id="form-password"
                      placeholder="Password"
                      required
                      value={field.state.value}
                      onChange={(val: string) => field.handleChange(val)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-destructive mt-1">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </Field>
                )}
              </form.Field>
              <form.Field
                name="confirmPassword"
                validators={{
                  onChangeListenTo: ['password'],
                  onBlurListenTo: ['password'],
                  onChange: ({ value, fieldApi }) => {
                    if (
                      value &&
                      value !== fieldApi.form.getFieldValue('password')
                    )
                      return 'Passwords do not match';
                    return undefined;
                  },
                  onBlur: ({ value }) => {
                    if (!value) return 'Please confirm your password';
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="form-confirm-password">
                      {t('auth:password.confirm')}
                    </FieldLabel>
                    <PasswordAutocomplete
                      id="form-confirm-password"
                      placeholder="Confirm password"
                      value={field.state.value}
                      onChange={(val: string) => field.handleChange(val)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-destructive mt-1">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
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
                        : t('auth:register.button')}
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

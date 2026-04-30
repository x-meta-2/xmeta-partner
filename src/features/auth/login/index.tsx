import { CustomDialogForm, PasswordAutocomplete } from '#/components/common';
import { Button } from '#/components/ui/button';
import { EmailAutocomplete } from '#/components/ui/email-autocomplete';
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field';
import { Separator } from '#/components/ui/separator';
import { AuthCarousel } from '#/features/auth/components/auth-carousel';
import QrLogin from '#/features/auth/components/QrLogin';
import { useAuthActions } from '#/hooks/use-auth-actions.ts';
import { useBoolean } from '#/hooks/use-boolean';
import { useI18n } from '#/i18n/context';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '#/components/ui/hover-card';
import { useForm } from '@tanstack/react-form';
import { QrCodeIcon } from 'lucide-react';
import { useRef } from 'react';
import Turnstile from 'react-turnstile';

export const LoginPage = () => {
  const { t } = useI18n();
  const { login } = useAuthActions();

  const {
    value: captchaOpen,
    setTrue: openCaptcha,
    setFalse: closeCaptcha,
  } = useBoolean();

  const pendingValues = useRef<{ email: string; password: string } | null>(
    null,
  );

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      pendingValues.current = value;
      openCaptcha();
    },
  });

  const handleVerify = async (token: string) => {
    if (!pendingValues.current) return;
    closeCaptcha();
    await login(pendingValues.current, { captcha: token });
    pendingValues.current = null;
  };

  return (
    <>
      <CustomDialogForm
        showCloseButton={false}
        className="p-0"
        open={captchaOpen}
        width={380}
        showFooter={false}
        onOpenChange={closeCaptcha}
      >
        <div className="w-72 flex items-center justify-center mx-auto py-1">
          <Turnstile
            sitekey="0x4AAAAAAB6pa_vjK_5VNI8n"
            onVerify={handleVerify}
            onExpire={closeCaptcha}
            onError={closeCaptcha}
          />
        </div>
      </CustomDialogForm>
      <div className="flex">
        <div className="w-2/5 p-3 hidden lg:block">
          <AuthCarousel />
        </div>
        <div className="w-full lg:w-3/5 flex flex-col justify-center mb-14 h-[80vh] max-w-sm mx-auto px-4 sm:px-0">
          <div className="flex justify-between items-center w-full mb-4">
            <h1 className="text-center text-2xl font-bold">
              {t('auth:login.title')}
            </h1>
            <HoverCard openDelay={10} closeDelay={100}>
              <HoverCardTrigger asChild className="cursor-pointer">
                <QrCodeIcon />
              </HoverCardTrigger>
              <HoverCardContent className="w-fit rounded-4xl">
                <QrLogin />
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="flex items-center justify-center border border-border rounded-full p-1.5 mb-4 gap-4">
            <img src="/assets/logo/lock-green.svg" alt="Lock" />
            <span>https://www.x-meta.com</span>
          </div>
          <p className="text-center text-sm text-muted-foreground mb-3">
            {t('auth:login.subtitle')}
          </p>
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
                      hideRequirements
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
                        ? t('auth:login.submitting', 'Signing in…')
                        : t('auth:login.button')}
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

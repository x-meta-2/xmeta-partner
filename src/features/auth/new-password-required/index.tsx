import { PasswordAutocomplete } from '#/components/common';
import { Button } from '#/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field';
import { Separator } from '#/components/ui/separator';
import { useI18n } from '#/i18n/context';

import { getErrorMessage } from '#/utils/get-error-message';
import { useForm } from '@tanstack/react-form';
import { confirmSignIn } from 'aws-amplify/auth';
import { toast } from 'sonner';
import { useLocalizedNavigate } from '#/hooks/use-localized-navigate';

export const NewPasswordRequiredPage = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useI18n();

  const form = useForm({
    defaultValues: {
      newPassword: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await confirmSignIn({ challengeResponse: value.newPassword });
        await void navigate('/dashboard/overview');
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
  });

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full flex flex-col justify-center mb-14 h-[80vh] max-w-sm mx-auto px-4 sm:px-0">
          <h1 className="text-center text-2xl font-bold mb-3">
            {t('partner:auth.updatePassword')}
          </h1>
          <p className="text-center text-sm text-muted-foreground mb-4">
            {t('partner:auth.newPasswordRequired')}
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
                name="newPassword"
                validators={{
                  onBlur: ({ value }) => {
                    if (!value) return t('partner:auth.passwordRequired');
                    if (value.length < 8)
                      return t('partner:auth.passwordMinLength');
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="form-new-password">
                      {t('partner:auth.newPassword')}
                    </FieldLabel>
                    <PasswordAutocomplete
                      id="form-new-password"
                      placeholder={t('partner:auth.enterNewPassword')}
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
                        ? t('partner:auth.updating')
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
                  onClick={() => void navigate('/auth/login')}
                >
                  {t('partner:common.cancel')}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </>
  );
};

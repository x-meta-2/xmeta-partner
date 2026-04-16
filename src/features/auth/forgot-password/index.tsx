import { Button } from '#/components/ui/button';
import { EmailAutocomplete } from '#/components/ui/email-autocomplete';
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field';
import { Separator } from '#/components/ui/separator';
import { useI18n } from '#/i18n/context';
import { AuthCarousel } from '../components/auth-carousel';

export const ForgotPasswordPage = () => {
  const { t } = useI18n();
  return (
    <div className="flex">
      <div className="w-2/5 p-3 hidden lg:block">
        <AuthCarousel />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col justify-center mb-14 h-[80vh] max-w-sm mx-auto px-4 sm:px-0">
        <h1 className="text-center text-2xl font-bold mb-3">
          {t('auth:forgot.title')}
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-4">
          {t('auth:forgot.subtitle')}
        </p>
        <Separator className="my-7" />
        <FieldGroup className="flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor="form-name">{t('auth:email')}</FieldLabel>
            <EmailAutocomplete id="form-email" placeholder="Email" required />
          </Field>
          <Field orientation="horizontal" className="mt-3">
            <Button type="submit" className="w-full py-5.5">
              {t('auth:forgot.button')}
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
};

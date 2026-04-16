import { Button } from '#/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field';
import { Input } from '#/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import { Separator } from '#/components/ui/separator';
import { useCountries } from '#/hooks/use-counties';
import { useI18n } from '#/i18n/context';
import { AuthCarousel } from '#/features/auth/components/auth-carousel';
import type { Country } from '#/services/index.ts';
import { useForm } from '@tanstack/react-form';
import { useEffect, useState } from 'react';
import { useLocalizedNavigate } from '#/hooks/use-localized-navigate';

export const PhoneRegisterPage = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useI18n();
  const { data: countries } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();

  const form = useForm({
    defaultValues: {
      country: '',
      phone: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      localStorage.setItem('phone', value.phone);
      void navigate('/verify-phone');
    },
  });

  useEffect(() => {
    if (!countries?.length) return;

    const mongolia = countries.find(
      (c: Country) => c.alpha2 === 'MN' || c.name === 'Mongolia',
    );

    if (mongolia) {
      setSelectedCountry(mongolia.code);
      form.setFieldValue('country', mongolia.code);
    }
  }, [countries]);

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
            {t('auth:register.phone.title')}
          </h1>
          <p className="text-center text-md text-muted-foreground mb-2">
            {t('auth:register.phone.description')}
          </p>
          <Separator className="my-4" />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="flex flex-col gap-5">
              <div className="flex gap-4">
                <form.Field name="country">
                  {(field) => (
                    <Field className="w-fit">
                      <FieldLabel htmlFor="form-country">Country</FieldLabel>
                      <Select
                        value={selectedCountry}
                        onValueChange={(value) => {
                          setSelectedCountry(value);
                          field.handleChange(value);
                        }}
                      >
                        <SelectTrigger className="w-full max-w-28 py-5.5 rounded-xl">
                          <SelectValue placeholder="Country code" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {countries?.map((item: Country) => (
                              <SelectItem key={item.code} value={item.code}>
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">{item.emoji}</span>
                                  <span className="font-medium">
                                    {item.dialCode}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                </form.Field>
                <form.Field
                  name="phone"
                  validators={{
                    onBlur: ({ value }) => {
                      if (value && !/^\+?[\d\s\-()]{6,20}$/.test(value))
                        return 'Enter a valid phone number';
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Field className="flex-1">
                      <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
                      <Input
                        id="form-phone"
                        type="tel"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
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
              </div>
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

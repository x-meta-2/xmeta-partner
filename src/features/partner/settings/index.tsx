import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { PageHeader } from '#/components/common/page-header';
import { Button } from '#/components/ui/button';
import { Card } from '#/components/ui/card';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { Separator } from '#/components/ui/separator';
import { useI18n } from '#/i18n/context';
import { getProfile, updateProfile } from '#/services/apis/partner/profile';
import { loadUserProfile } from '#/stores/auth-actions';
import { formatLongDate } from '#/utils/date';
import { formatRate } from '#/utils/tier';

export function PartnerSettingsPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const partnerQuery = useQuery({
    queryKey: ['partner', 'profile'],
    queryFn: getProfile,
  });
  const partner = partnerQuery.data;

  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');

  useEffect(() => {
    if (partner) {
      setCompanyName(partner.companyName ?? '');
      setWebsite(partner.website ?? '');
      setFacebook(partner.socialMedia?.facebook ?? '');
      setInstagram(partner.socialMedia?.instagram ?? '');
    }
  }, [partner]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success('Settings saved');
      queryClient.invalidateQueries({ queryKey: ['partner', 'profile'] });
      void loadUserProfile();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    },
  });

  const save = () => {
    updateMutation.mutate({
      companyName,
      website,
      socialMedia: { facebook, instagram },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('partner:settings.title')}
        description={t('partner:settings.description')}
      />

      <Card className="gap-5 p-6">
        <div>
          <div className="text-base font-semibold">{t('partner:settings.identity.title')}</div>
          <div className="text-xs text-muted-foreground">
            {t('partner:settings.identity.description')}
          </div>
        </div>
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <Field label={t('partner:settings.identity.firstName')}>
            <Input value={partner?.user?.firstName ?? ''} disabled />
          </Field>
          <Field label={t('partner:settings.identity.lastName')}>
            <Input value={partner?.user?.lastName ?? ''} disabled />
          </Field>
          <Field label={t('partner:settings.identity.email')}>
            <Input value={partner?.user?.email ?? ''} disabled />
          </Field>
        </div>
      </Card>

      <Card className="gap-5 p-6">
        <div>
          <div className="text-base font-semibold">{t('partner:settings.profile.title')}</div>
          <div className="text-xs text-muted-foreground">
            {t('partner:settings.profile.description')}
          </div>
        </div>
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <Field label={t('partner:settings.profile.company')} hint={t('partner:settings.profile.optional')}>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Demo Trading"
            />
          </Field>
          <Field label={t('partner:settings.profile.website')} hint={t('partner:settings.profile.optional')}>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://…"
            />
          </Field>
          <Field label={t('partner:settings.profile.facebook')}>
            <Input
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/yourpage"
            />
          </Field>
          <Field label={t('partner:settings.profile.instagram')}>
            <Input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/yourhandle"
            />
          </Field>
        </div>
      </Card>

      <Card className="gap-0 p-0">
        <div className="p-6 pb-3">
          <div className="text-base font-semibold">{t('partner:settings.account.title')}</div>
        </div>
        <div className="space-y-3 px-6 pb-6 text-sm">
          <InfoRow label={t('partner:settings.account.partnerId')}>
            <span className="font-mono">{partner?.id ?? '—'}</span>
          </InfoRow>
          <Separator className="opacity-40" />
          <InfoRow label={t('partner:settings.account.referralCode')}>
            <span className="font-mono font-semibold text-primary">
              {partner?.referralCode ?? '—'}
            </span>
          </InfoRow>
          <Separator className="opacity-40" />
          <InfoRow label={t('partner:settings.account.currentTier')}>
            <span className="font-medium">
              {partner?.tier
                ? `${partner.tier.name} · ${formatRate(partner.tier.commissionRate)}`
                : '—'}
            </span>
          </InfoRow>
          <Separator className="opacity-40" />
          <InfoRow label={t('partner:settings.account.memberSince')}>
            <span>
              {partner?.createdAt ? formatLongDate(partner.createdAt) : '—'}
            </span>
          </InfoRow>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={updateMutation.isPending}>
          <Save className="size-4" />
          {updateMutation.isPending ? t('partner:settings.saving') : t('partner:settings.save')}
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

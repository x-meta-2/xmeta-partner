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
import { getProfile, updateProfile } from '#/services/apis/partner/profile';
import { loadUserProfile } from '#/stores/auth-actions';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export function PartnerSettingsPage() {
  const queryClient = useQueryClient();

  const partnerQuery = useQuery({
    queryKey: ['partner', 'profile'],
    queryFn: getProfile,
  });
  const partner = partnerQuery.data;

  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (partner) {
      setCompanyName(partner.companyName ?? '');
      setPhone(partner.phone ?? '');
      setCountry(partner.country ?? '');
      setWebsite(partner.website ?? '');
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
    updateMutation.mutate({ companyName, phone, country, website });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your partner account settings"
      />

      <Card className="gap-5 p-6">
        <div>
          <div className="text-base font-semibold">Identity</div>
          <div className="text-xs text-muted-foreground">
            Name and email are managed from your xmeta account.
          </div>
        </div>
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <Field label="First Name">
            <Input value={partner?.user?.firstName ?? ''} disabled />
          </Field>
          <Field label="Last Name">
            <Input value={partner?.user?.lastName ?? ''} disabled />
          </Field>
          <Field label="Email">
            <Input value={partner?.user?.email ?? ''} disabled />
          </Field>
        </div>
      </Card>

      <Card className="gap-5 p-6">
        <div>
          <div className="text-base font-semibold">Partner Profile</div>
          <div className="text-xs text-muted-foreground">
            Details specific to your partner account
          </div>
        </div>
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <Field label="Company Name">
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </Field>
          <Field label="Phone Number">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+976 xxxx xxxx"
            />
          </Field>
          <Field label="Country">
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </Field>
          <Field label="Website">
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://…"
            />
          </Field>
        </div>
      </Card>

      <Card className="gap-0 p-0">
        <div className="p-6 pb-3">
          <div className="text-base font-semibold">Partner Account</div>
        </div>
        <div className="space-y-3 px-6 pb-6 text-sm">
          <InfoRow label="Partner ID">
            <span className="font-mono">{partner?.id ?? '—'}</span>
          </InfoRow>
          <Separator className="opacity-40" />
          <InfoRow label="Referral Code">
            <span className="font-mono font-semibold text-primary">
              {partner?.referralCode ?? '—'}
            </span>
          </InfoRow>
          <Separator className="opacity-40" />
          <InfoRow label="Current Tier">
            <span className="font-medium">
              {partner?.tier
                ? `${partner.tier.name} · ${(partner.tier.commissionRate * 100).toFixed(0)}%`
                : '—'}
            </span>
          </InfoRow>
          <Separator className="opacity-40" />
          <InfoRow label="Member Since">
            <span>{partner?.createdAt ? formatDate(partner.createdAt) : '—'}</span>
          </InfoRow>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={updateMutation.isPending}>
          <Save className="size-4" />
          {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
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

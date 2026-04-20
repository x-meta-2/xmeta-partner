import { useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '#/components/ui/card';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { Separator } from '#/components/ui/separator';
import { PageHeader } from '#/components/common/page-header';
import { mockPartner } from '#/features/partner/mock';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export function PartnerSettingsPage() {
  const [name, setName] = useState(`${mockPartner.firstName} ${mockPartner.lastName}`);
  const [phone, setPhone] = useState(mockPartner.phone ?? '');
  const [wallet, setWallet] = useState(mockPartner.walletAddress ?? '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success('Settings saved (mock)');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your partner account settings" />

      {/* Profile Information */}
      <Card className="gap-5 p-6">
        <div>
          <div className="text-base font-semibold">Profile Information</div>
          <div className="text-xs text-muted-foreground">
            Update your personal details and contact information
          </div>
        </div>
        <div className="max-w-lg space-y-4">
          <Field label="Full Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field
            label="Email"
            hint="Email cannot be changed. Contact support if needed."
          >
            <Input value="partner@x-meta.com" disabled />
          </Field>
          <Field label="Phone Number">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+976 xxxx xxxx"
            />
          </Field>
        </div>
      </Card>

      {/* Payout Settings */}
      <Card className="gap-5 p-6">
        <div>
          <div className="text-base font-semibold">Payout Settings</div>
          <div className="text-xs text-muted-foreground">
            Configure your payout wallet address
          </div>
        </div>
        <div className="max-w-lg">
          <Field label="USDT Wallet Address (TRC-20)">
            <Input
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="Enter your TRC-20 wallet address"
              className="font-mono text-sm"
            />
          </Field>
        </div>
      </Card>

      {/* Partner Account — read-only */}
      <Card className="gap-0 p-0">
        <div className="p-6 pb-3">
          <div className="text-base font-semibold">Partner Account</div>
        </div>
        <div className="space-y-3 px-6 pb-6 text-sm">
          <InfoRow label="Partner ID">
            <span className="font-mono">{mockPartner.id}</span>
          </InfoRow>
          <Separator className="opacity-40" />
          <InfoRow label="Referral Code">
            <span className="font-mono font-semibold text-primary">
              {mockPartner.referralCode}
            </span>
          </InfoRow>
          <Separator className="opacity-40" />
          <InfoRow label="Current Tier">
            <span className="font-medium">
              {mockPartner.tier.name} · {mockPartner.tier.commissionRate}%
            </span>
          </InfoRow>
          <Separator className="opacity-40" />
          <InfoRow label="Member Since">
            <span>{formatDate(mockPartner.createdAt)}</span>
          </InfoRow>
        </div>
      </Card>

      {/* Save footer */}
      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>
          <Save className="size-4" />
          {saving ? 'Saving…' : 'Save Changes'}
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

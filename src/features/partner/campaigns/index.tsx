import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRightLeft,
  Check,
  Copy,
  DollarSign,
  MousePointerClick,
  Plus,
  UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '#/components/ui/card';
import { Button } from '#/components/ui/button';
import { StatusTag } from '#/components/common/status-tag';
import { PageHeader } from '#/components/common/page-header';
import { mockCampaigns, mockPartner } from '#/features/partner/mock';
import type { Campaign } from '#/services/types/partner.types';

const money = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const num = (v: number) => v.toLocaleString('en-US');

export function PartnerCampaignsPage() {
  const { data: campaigns = mockCampaigns } = useQuery({
    queryKey: ['partner', 'campaigns'],
    queryFn: () => Promise.resolve(mockCampaigns),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description="Manage your referral campaigns and track performance"
      />

      <DefaultLinkCard code={mockPartner.referralCode} />

      <div className="flex items-center justify-between">
        <div className="text-base font-semibold">Your Campaigns</div>
        <Button onClick={() => toast.info('Campaign form (Phase 3.5)')}>
          <Plus className="size-4" /> Create Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          No campaigns yet. Create one to track your marketing efforts.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function DefaultLinkCard({ code }: { code: string }) {
  const url = `https://x-meta.com/ref/${code}`;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Default link copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="gap-3 p-5">
      <div className="text-base font-medium">Default Referral Link</div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex-1 truncate rounded-lg border bg-muted/40 px-3 py-2.5 font-mono text-sm text-muted-foreground">
          {url}
        </div>
        <Button variant="outline" onClick={copy}>
          {copied ? (
            <>
              <Check className="size-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="size-4" /> Copy Link
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(campaign.link);
    setCopied(true);
    toast.success('Campaign link copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold">{campaign.name}</div>
          <div className="truncate font-mono text-xs text-muted-foreground">
            {campaign.link}
          </div>
        </div>
        <StatusTag status={campaign.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 border-t pt-4">
        <StatBlock
          icon={<MousePointerClick className="size-4" />}
          label="Clicks"
          value={num(campaign.clicks)}
        />
        <StatBlock
          icon={<UserPlus className="size-4" />}
          label="Signups"
          value={num(campaign.signups)}
        />
        <StatBlock
          icon={<ArrowRightLeft className="size-4" />}
          label="Conversions"
          value={num(campaign.conversions)}
        />
        <StatBlock
          icon={<DollarSign className="size-4 text-primary" />}
          label="Commission"
          value={money(campaign.commission)}
          valueClassName="text-primary"
        />
      </div>

      <Button variant="outline" className="w-full" onClick={copy}>
        {copied ? (
          <>
            <Check className="size-4" /> Copied!
          </>
        ) : (
          <>
            <Copy className="size-4" /> Copy Link
          </>
        )}
      </Button>
    </Card>
  );
}

function StatBlock({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-muted-foreground">{label}</div>
        <div
          className={`truncate text-sm font-semibold tabular-nums ${valueClassName ?? ''}`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

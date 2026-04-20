import { Megaphone, Clock } from 'lucide-react';
import { Card } from '#/components/ui/card';
import { PageHeader } from '#/components/common/page-header';

export function PartnerCampaignsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description="Create and manage your marketing campaigns"
      />

      <Card className="flex flex-col items-center gap-4 p-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <Megaphone className="size-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Coming Soon</h3>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Campaign management is currently under development. You&apos;ll soon
            be able to create targeted campaigns, track performance across
            channels, and optimize your referral strategy.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs font-medium text-muted-foreground">
          <Clock className="size-3.5" />
          Expected launch: Q3 2026
        </div>
      </Card>
    </div>
  );
}

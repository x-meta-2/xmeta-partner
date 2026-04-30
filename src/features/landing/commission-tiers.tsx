import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Trophy, Users, BarChart3 } from 'lucide-react';
import { LocalizedLink } from '#/components/common/localized-link';
import { Button } from '#/components/ui/button';
import { Card } from '#/components/ui/card';
import { Skeleton } from '#/components/ui/skeleton';
import type { PartnerTier } from '#/services/apis/partner/types';
import { getPublicTiers } from '#/services/apis/public';
import { formatRate, formatVolumeRange, topTierRate } from '#/utils/tier';

export function LandingCommissionTiers() {
  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ['public-tiers'],
    queryFn: getPublicTiers,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="border-y border-border/40 bg-muted/20">
      <div className="mx-auto max-w-[1200px] px-4 py-20 xl:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            X-Meta Partner Commission Program
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Earn monthly commissions from every user you refer — the more active
            clients and volume you bring, the more you earn.
          </p>
        </div>

        <Card className="grid gap-10 overflow-hidden p-0 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6 p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Trophy className="size-5" />
              </div>
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                How It Works
              </div>
            </div>
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Five tiers. Up to {topTierRate(tiers)} commission.{' '}
              <span className="text-primary">Zero cap.</span>
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Climb the tier ladder as your active client count and referred
              trading volume grow. Every trade your referrals make generates a
              commission for you — paid out in USDT automatically.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <span>
                  <strong>Active client</strong> = futures trade within last 120
                  days
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" />
                <span>
                  <strong>Volume</strong> = total USDT trading volume
                </span>
              </div>
            </div>
            <LocalizedLink to="/login">
              <Button className="gap-2">
                Join the Program <ArrowRight className="size-4" />
              </Button>
            </LocalizedLink>
          </div>

          <div className="border-t border-border bg-background/40 p-8 lg:border-l lg:border-t-0 lg:p-10">
            <div className="mb-3 grid grid-cols-[1fr_auto_auto] gap-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Tier</span>
              <span className="w-20 text-center">Clients</span>
              <span className="w-24 text-right">Rate</span>
            </div>

            <div className="space-y-2">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-[58px] w-full rounded-lg" />
                  ))
                : tiers.map((tier) => <TierRow key={tier.id} tier={tier} />)}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function TierRow({ tier }: { tier: PartnerTier }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-lg border border-border/60 bg-card px-4 py-3">
      <div>
        <div
          className="font-semibold"
          style={{ color: tier.color || undefined }}
        >
          {tier.name}
        </div>
        <div className="text-xs text-muted-foreground">
          Vol: {formatVolumeRange(tier.minVolume, tier.maxVolume)}
        </div>
      </div>
      <div className="w-20 text-center text-sm font-medium">
        {tier.minActiveClients}+
      </div>
      <div className="w-24 text-right text-lg font-bold text-primary tabular-nums">
        {formatRate(tier.commissionRate)}
      </div>
    </div>
  );
}

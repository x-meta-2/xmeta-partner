import { ArrowRight, Trophy } from 'lucide-react';
import { Card } from '#/components/ui/card';
import { Button } from '#/components/ui/button';
import { LocalizedLink } from '#/components/common/localized-link';
import { commissionTiers } from './data';

export function LandingCommissionTiers() {
  return (
    <section className="border-y border-border/40 bg-muted/20">
      <div className="mx-auto max-w-[1200px] px-4 py-20 xl:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            X-Meta Partner Commission Program
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Earn monthly commissions from every user you refer — the more they
            trade, the more you earn.
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
              Five tiers. Up to 50% commission.{' '}
              <span className="text-primary">Zero cap.</span>
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Climb the tier ladder as your referred trading volume grows. Every
              trade your referrals make generates a commission for you — paid
              out in USDT automatically.
            </p>
            <LocalizedLink to="/register">
              <Button className="gap-2">
                Join the Program <ArrowRight className="size-4" />
              </Button>
            </LocalizedLink>
          </div>

          <div className="border-t border-border bg-background/40 p-8 lg:border-l lg:border-t-0 lg:p-10">
            <div className="space-y-3">
              {commissionTiers.map((t, i) => (
                <div
                  key={t.name}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-card px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.threshold}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary tabular-nums">
                    {t.rate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

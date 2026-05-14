import { ArrowRight, LogIn } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { LocalizedLink } from '#/components/common/localized-link';
import { useI18n } from '#/i18n/context';

export function LandingHero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 size-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute left-1/4 top-1/2 size-[500px] -translate-y-1/2 rounded-full bg-chart-2/20 blur-[120px]" />
      </div>

      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 px-4 py-24 text-center xl:py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="size-1.5 rounded-full bg-success animate-pulse" />
          {t('landing:hero.title')}
        </span>

        <div className="space-y-5">
          <h1 className="mx-auto max-w-[28ch] text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
            {t('landing:hero.subtitle')}
          </h1>
          <p className="mx-auto max-w-[56ch] text-base text-muted-foreground sm:text-lg">
            {t('landing:hero.description')}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <LocalizedLink to="/login">
            <Button size="lg" className="h-12 gap-2 px-6">
              {t('landing:hero.apply')} <ArrowRight className="size-4" />
            </Button>
          </LocalizedLink>
          <LocalizedLink to="/login">
            <Button size="lg" variant="outline" className="h-12 gap-2 px-6">
              <LogIn className="size-4" /> {t('landing:hero.login')}
            </Button>
          </LocalizedLink>
        </div>

      </div>
    </section>
  );
}

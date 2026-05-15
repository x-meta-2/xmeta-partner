import { ArrowRight } from 'lucide-react';
import { Card } from '#/components/ui/card';
import { Button } from '#/components/ui/button';
import { LocalizedLink } from '#/components/common/localized-link';
import { useI18n } from '#/i18n/context';
import { getLandingSteps } from './data';

export function LandingSteps() {
  const { t } = useI18n();
  const steps = getLandingSteps(t);

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 xl:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('landing:join.subtitle')}
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          {t('landing:join.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {steps.map((s, index) => (
          <Card key={s.number} className="group gap-4 overflow-hidden p-0">
            <div className="relative flex h-52 items-center justify-center overflow-hidden border-b border-border/50 bg-[#14172f]">
              <div className="absolute inset-x-10 bottom-2 h-16 rounded-full bg-primary/20 blur-3xl" />
              <img
                src={`/assets/images/landing/${index + 1}.png`}
                alt=""
                aria-hidden="true"
                className="relative h-44 w-44 object-contain transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-4 p-6">
              <h3 className="text-lg font-semibold leading-snug">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <LocalizedLink to="/login">
          <Button size="lg" className="h-12 gap-2 px-8">
            {t('landing:hero.apply')} <ArrowRight className="size-4" />
          </Button>
        </LocalizedLink>
      </div>
    </section>
  );
}

import { Card } from '#/components/ui/card';
import { landingBenefits } from './data';

export function LandingBenefits() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 xl:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Exclusive Benefits for X-Meta Partners
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Everything you need to turn your audience into a recurring revenue
          stream.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {landingBenefits.map((b) => (
          <Card
            key={b.title}
            className="group gap-4 p-6 transition-colors hover:border-primary/40"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform group-hover:scale-110">
              <b.icon className="size-6" strokeWidth={1.75} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold leading-snug">{b.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {b.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

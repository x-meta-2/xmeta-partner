import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion';
import { landingFaqs } from './data';

export function LandingFaq() {
  return (
    <section className="border-t border-border/40 bg-muted/20">
      <div className="mx-auto max-w-[860px] px-4 py-20 xl:py-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion
          type="single"
          collapsible
          className="rounded-2xl border border-border bg-card px-6"
          defaultValue="q-0"
        >
          {landingFaqs.map((f, i) => (
            <AccordionItem key={f.question} value={`q-${i}`}>
              <AccordionTrigger>{f.question}</AccordionTrigger>
              <AccordionContent>
                <p className="leading-relaxed">{f.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

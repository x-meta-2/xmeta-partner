import { LandingHero } from './hero';
import { LandingBenefits } from './benefits';
import { LandingCommissionTiers } from './commission-tiers';
import { LandingSteps } from './steps';
import { LandingFaq } from './faq';
import { LandingStickyCta } from './sticky-cta';

export function LandingPage() {
  return (
    <div className="flex flex-col">
      <LandingHero />
      <LandingBenefits />
      <LandingCommissionTiers />
      <LandingSteps />
      <LandingFaq />
      <LandingStickyCta />
    </div>
  );
}

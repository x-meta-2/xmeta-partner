import { LocalizedLink } from '#/components/common/localized-link';
import { LanguageToggle } from '#/components/layout/language-toggle';
import { Button } from '#/components/ui/button';

/**
 * Public landing-page header.
 *
 * Minimal: logo + language toggle + "Log In" / "Apply Now" CTAs. No profile
 * dropdown or notifications — that's reserved for the authenticated topbar.
 */
export function LandingTopBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 xl:px-8">
        <LocalizedLink to="/" className="flex items-center gap-2">
          <img
            src="/assets/logo/logo-light.svg"
            alt="X-Meta"
            width={96}
            className="block dark:hidden"
          />
          <img
            src="/assets/logo/logo-dark.svg"
            alt="X-Meta"
            width={96}
            className="hidden dark:block"
          />
          <span className="hidden rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary sm:inline-block">
            Partner
          </span>
        </LocalizedLink>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <LocalizedLink to="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Log In
            </Button>
          </LocalizedLink>
          <LocalizedLink to="/register">
            <Button size="sm">Apply Now</Button>
          </LocalizedLink>
        </div>
      </div>
    </header>
  );
}

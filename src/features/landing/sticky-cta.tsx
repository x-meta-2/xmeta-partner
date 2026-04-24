import { useEffect, useState } from 'react';
import { Gift, X } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { LocalizedLink } from '#/components/common/localized-link';

/**
 * Sticky bottom CTA — appears after scrolling past the hero.
 * Dismissable; stays hidden for the rest of the session.
 */
export function LandingStickyCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => setVisible(window.scrollY > 600);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur-xl">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Gift className="size-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">
            Sign up now and claim your 10,000 USDT partner bonus
          </div>
          <div className="truncate text-xs text-muted-foreground">
            Limited time — available for the first 1,000 approved partners
          </div>
        </div>
        <LocalizedLink to="/login">
          <Button size="sm" className="shrink-0">
            Sign Up
          </Button>
        </LocalizedLink>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

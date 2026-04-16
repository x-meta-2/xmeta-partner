import { useEffect, useState } from 'react';
import { Bell, ChevronDown, LogOut, Moon, Settings, Sun } from 'lucide-react';

import { Button } from '#/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover';
import { LocalizedLink } from '#/components/common/localized-link';
import { LanguageToggle } from '#/components/layout/language-toggle';
import { cn } from '#/lib/utils';
import { useTheme } from '#/hooks/use-theme';
import { mockPartner } from '#/features/partner/mock';

/**
 * Partner dashboard top bar.
 *
 * Minimal, sidebar-complementary header: logo → notification → theme → profile.
 * No public-facing navigation (market/exchange/buy/convert/news) — those belong
 * to the old consumer web-v4 navbar which we've removed.
 */
export function PartnerTopBar() {
  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 xl:px-8">
        <LocalizedLink to="/dashboard/overview" className="flex items-center gap-2">
          <img src="/assets/logo/logo-light.svg" alt="X-Meta" width={92} className="block dark:hidden" />
          <img src="/assets/logo/logo-dark.svg" alt="X-Meta" width={92} className="hidden dark:block" />
          <span className="hidden rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary sm:inline-block">
            Partner
          </span>
        </LocalizedLink>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <NotificationButton />
          <ThemeToggleButton />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

function IconButton({
  label,
  children,
  onClick,
  className,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={onClick}
      className={cn('size-9 rounded-full hover:bg-muted', className)}
    >
      {children}
    </Button>
  );
}

function NotificationButton() {
  return (
    <IconButton label="Notifications">
      <div className="relative">
        <Bell className="size-4.5" />
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
      </div>
    </IconButton>
  );
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <IconButton label="Theme">
        <Sun className="size-4.5" />
      </IconButton>
    );
  }

  const isDark = theme === 'dark';
  return (
    <IconButton
      label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={() => toggleTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
    </IconButton>
  );
}

function ProfileMenu() {
  const partner = mockPartner;
  const initials = partner.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 text-sm transition-colors hover:bg-muted"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-[11px] font-semibold text-primary-foreground">
            {initials}
          </span>
          <span className="hidden max-w-[120px] truncate font-medium md:inline">
            {partner.name}
          </span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0">
        <div className="border-b p-3">
          <div className="font-medium">{partner.name}</div>
          <div className="truncate text-xs text-muted-foreground">
            {partner.email}
          </div>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-semibold text-warning">
            {partner.tier.name} · {partner.tier.commissionRate}%
          </div>
        </div>
        <div className="p-1">
          <LocalizedLink
            to="/dashboard/settings"
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
          >
            <Settings className="size-4" /> Settings
          </LocalizedLink>
          <button
            type="button"
            onClick={() => {
              // TODO wire to logout action once Phase 2 auth lands
              console.warn('logout — wire in Phase 2');
            }}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-destructive hover:bg-destructive-soft"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

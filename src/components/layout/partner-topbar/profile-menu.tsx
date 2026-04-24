import { ChevronDown, LogOut, Settings } from 'lucide-react';

import { LocalizedLink } from '#/components/common/localized-link';
import { PartnerStatusBadge } from '#/components/common/partner-status-badge';
import { Badge } from '#/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover';
import { signOutAndReset } from '#/stores/auth-actions';
import { useAuthStore } from '#/stores/auth-store';

export function ProfileMenu() {
  const partner = useAuthStore((s) => s.auth.partner);
  const application = useAuthStore((s) => s.auth.application);
  const user = useAuthStore((s) => s.auth.user);

  // `partner.user` is set for active partners; fall back to the
  // onboarding-time `user` snapshot for applicants / non-partners.
  const profile = partner?.user ?? user;
  const email = profile?.email ?? '';
  const fullName = profile
    ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()
    : '';

  const initials = buildInitials(fullName || email);

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
          <span className="hidden max-w-[180px] truncate font-medium md:inline">
            {email || fullName || 'Partner'}
          </span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-0">
        <div className="space-y-2 border-b p-3">
          <div>
            <div className="truncate font-medium">
              {fullName || email || 'Partner'}
            </div>
            {fullName && email && (
              <div className="truncate text-xs text-muted-foreground">
                {email}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <PartnerStatusBadge
              partner={partner}
              application={application}
              user={user}
            />
            {partner?.tier && (
              <Badge variant="default">
                {partner.tier.name} ·{' '}
                {`${(partner.tier.commissionRate * 100).toFixed(0)}%`}
              </Badge>
            )}
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
            onClick={() => void signOutAndReset()}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-destructive hover:bg-destructive-soft"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function buildInitials(source: string): string {
  const tokens = source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return tokens || '··';
}

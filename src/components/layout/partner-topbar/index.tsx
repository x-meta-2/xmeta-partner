import { ThemeToggle } from '#/components/common/theme-toggle';
import { LanguageToggle } from '#/components/layout/language-toggle';

import { Logo } from './logo';
import { NotificationButton } from './notification-button';
import { ProfileMenu } from './profile-menu';

/**
 * Partner dashboard top bar.
 *
 * Minimal, sidebar-complementary header: logo → language → notification →
 * theme → profile. All sub-pieces live as siblings in this folder.
 */
export function PartnerTopBar() {
  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 xl:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <NotificationButton />
          <ThemeToggle />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

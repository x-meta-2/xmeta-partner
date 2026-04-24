import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '#/components/ui/button';
import { useTheme } from '#/hooks/use-theme';

/**
 * ThemeToggle — global theme switcher. Renders the same round-icon-button
 * visual as the topbar so landing and dashboard share a consistent control.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={() => mounted && toggleTheme(isDark ? 'light' : 'dark')}
      className="size-9 rounded-full hover:bg-muted"
    >
      {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
    </Button>
  );
}

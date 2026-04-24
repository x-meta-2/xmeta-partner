import type { ReactNode } from 'react';

import { Button } from '#/components/ui/button';
import { cn } from '#/lib/utils';

/** Round, muted icon-only button — the visual unit used throughout the topbar. */
export function IconButton({
  label,
  children,
  onClick,
  className,
}: {
  label: string;
  children: ReactNode;
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

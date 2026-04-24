import { Loader2 } from 'lucide-react';

import { cn } from '#/lib/utils';

/**
 * PageLoader — centered spinner for full-page loading / route transitions.
 *
 * Usage:
 *   - As a fallback in Suspense/React.lazy
 *   - As TanStack Router's `pendingComponent`
 *   - In-page when a mutation is loading and you want to block the UI
 */
export function PageLoader({
  label,
  fullScreen = false,
  className,
}: {
  label?: string;
  fullScreen?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center gap-3 text-muted-foreground',
        fullScreen ? 'min-h-screen' : 'min-h-[50vh]',
        className,
      )}
    >
      <Loader2 className="size-5 animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

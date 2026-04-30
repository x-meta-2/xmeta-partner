import { useEffect, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';

import { cn } from '#/lib/utils';

/**
 * Thin animated bar at the top of the viewport that lights up while the
 * router is fetching the next route's loaders. Mounts in `__root.tsx` so
 * every navigation gets the same affordance — without each page having to
 * render its own spinner.
 *
 * Behavior:
 *   - hidden while idle
 *   - on transition, snaps to 30% then crawls toward 90% (indeterminate
 *     because we don't know how long the loader will take)
 *   - on completion, sprints to 100% then fades out
 */
export function RouteProgressBar() {
  const isPending = useRouterState({
    select: (s) => s.isLoading || s.isTransitioning,
  });

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isPending) {
      setVisible(true);
      setProgress(30);
      const crawl = setInterval(() => {
        setProgress((p) => (p < 90 ? p + (90 - p) * 0.1 : p));
      }, 200);
      return () => clearInterval(crawl);
    }
    setProgress(100);
    const hide = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
    return () => clearTimeout(hide);
  }, [isPending]);

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed top-0 left-0 z-[100] h-0.5 w-full bg-transparent transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div
        className="h-full bg-primary transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

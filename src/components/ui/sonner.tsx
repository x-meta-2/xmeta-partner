import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { useTheme } from '#/hooks/use-theme';

/**
 * App toaster — fully driven by our design tokens.
 *
 * Sonner is given explicit per-status classNames so each toast picks the
 * correct `bg-*-soft` / `text-*` variant from our palette. No `richColors`
 * (Sonner's own hardcoded palette) — everything routes through CSS vars.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'light' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'group flex w-full items-start gap-3 rounded-xl border border-border bg-popover p-4 text-sm text-popover-foreground shadow-lg',
          title: 'text-sm font-medium leading-tight',
          description: 'mt-1 text-xs text-muted-foreground',
          actionButton:
            'ml-auto rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary-hover',
          cancelButton:
            'rounded-md bg-muted px-3 py-1 text-xs font-semibold text-foreground hover:bg-accent',
          closeButton:
            'absolute right-2 top-2 flex size-5 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground',
          icon: 'flex size-5 shrink-0 items-center justify-center',
          success:
            'border-success/40 bg-success-soft [&_[data-icon]]:text-success',
          info: 'border-info/40 bg-info-soft [&_[data-icon]]:text-info',
          warning:
            'border-warning/40 bg-warning-soft [&_[data-icon]]:text-warning',
          error:
            'border-destructive/40 bg-destructive-soft [&_[data-icon]]:text-destructive',
          loading: '[&_[data-icon]]:text-primary',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

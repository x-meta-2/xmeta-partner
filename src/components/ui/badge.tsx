import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '#/lib/utils';

/**
 * Badge — semantic status indicator built on design tokens.
 *
 * Variants are TOKEN-DRIVEN. Never hardcode colors at the call site;
 * pick the closest semantic variant or extend `badgeVariants` instead.
 *
 * @example
 *   <Badge variant="success">Verified</Badge>
 *   <Badge variant="warning">Pending</Badge>
 *   <Badge variant="destructive">Failed</Badge>
 */
const badgeVariants = cva(
  'inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a]:hover:bg-primary-hover',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        success:
          'border-transparent bg-success-soft text-success [a]:hover:bg-success-soft/80',
        warning:
          'border-transparent bg-warning-soft text-warning [a]:hover:bg-warning-soft/80',
        destructive:
          'border-transparent bg-destructive-soft text-destructive [a]:hover:bg-destructive-soft/80',
        info: 'border-transparent bg-info-soft text-info [a]:hover:bg-info-soft/80',
        outline:
          'border-border bg-transparent text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        muted:
          'border-transparent bg-muted text-muted-foreground [a]:hover:bg-muted/70',
      },
      size: {
        sm: 'h-4 px-1.5 text-[10px]',
        md: 'h-5 px-2 text-xs',
        lg: 'h-6 px-2.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

type BadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp
      data-slot="badge"
      data-variant={variant ?? 'default'}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants, type BadgeProps };

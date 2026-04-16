import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '#/lib/utils';

/**
 * Tag — compact label/pill for table cells and inline metadata.
 *
 * Smaller than `Badge`, with subtler weight. Use `Badge` for status that
 * needs to grab attention; use `Tag` for in-line categorisation.
 */
const tagVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted text-foreground',
        primary: 'border-transparent bg-primary-soft text-primary',
        success: 'border-transparent bg-success-soft text-success',
        warning: 'border-transparent bg-warning-soft text-warning',
        destructive: 'border-transparent bg-destructive-soft text-destructive',
        info: 'border-transparent bg-info-soft text-info',
        muted: 'border-transparent bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type TagProps = React.ComponentProps<'span'> &
  VariantProps<typeof tagVariants> & { asChild?: boolean };

function Tag({ className, variant, asChild = false, ...props }: TagProps) {
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp
      data-slot="tag"
      data-variant={variant ?? 'default'}
      className={cn(tagVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Tag, tagVariants, type TagProps };

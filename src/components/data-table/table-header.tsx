import type { ReactNode } from 'react';
import { cn } from '#/lib/utils';

export interface TableHeaderProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Standardised header strip for tables: title + description + optional action.
 *
 * Use as the `header` prop of `BaseTable` so all list pages share one chrome.
 */
export function DataTableHeader({
  title,
  description,
  action,
  className,
}: TableHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      {(title || description) && (
        <div className="flex flex-col gap-1">
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

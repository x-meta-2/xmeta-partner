import { Badge, type BadgeProps } from '#/components/ui/badge';

/**
 * StatusTag — domain-status → semantic variant mapper.
 *
 * Single source of truth for "what color is `pending`?" across the partner
 * portal. Add new statuses here, never inline a variant at the call site.
 */
type SemanticVariant = NonNullable<BadgeProps['variant']>;

const STATUS_VARIANT: Record<string, SemanticVariant> = {
  // success
  active: 'success',
  verified: 'success',
  completed: 'success',
  paid: 'success',
  confirmed: 'success',

  // info
  processing: 'info',

  // warning
  pending: 'warning',
  paused: 'warning',

  // destructive
  rejected: 'destructive',
  failed: 'destructive',
  suspended: 'destructive',

  // muted
  inactive: 'muted',
  ended: 'muted',
};

interface StatusTagProps {
  status?: string | null;
  className?: string;
  size?: BadgeProps['size'];
}

export function StatusTag({ status, className, size }: StatusTagProps) {
  // Defensive: backend rows occasionally return rows without a status
  // (legacy data, optional fields). Render a muted "—" rather than throw.
  if (!status) {
    return (
      <Badge variant="muted" size={size} className={className}>
        —
      </Badge>
    );
  }
  const variant = STATUS_VARIANT[status.toLowerCase()] ?? 'muted';
  return (
    <Badge
      variant={variant}
      size={size}
      className={`capitalize ${className ?? ''}`}
    >
      {status}
    </Badge>
  );
}

import { cn } from '#/lib/utils';
import { getTierImageSrc } from '#/utils/tier';

export function TierArtwork({
  tierName,
  className,
}: {
  tierName?: string | null;
  className?: string;
}) {
  const src = getTierImageSrc(tierName);

  return (
    <img
      src={src}
      alt={tierName ? `${tierName} tier` : 'Partner tier'}
      className={cn('shrink-0 object-contain', className)}
    />
  );
}

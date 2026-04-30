import type { PartnerTier } from '#/services/apis/partner/types';

/** "20%" — display a 0–1 commission rate as a whole-percent label. */
export function formatRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

/** "$15M" / "$30K" / "$500" — abbreviated USD volume for tier tables. */
export function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${Math.round(v / 1_000_000)}M`;
  if (v >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${v}`;
}

/** "$15M – $30M" or "$450M+" when the upper bound is open-ended. */
export function formatVolumeRange(min: number, max: number | null): string {
  if (max == null) return `${formatVolume(min)}+`;
  return `${formatVolume(min)} – ${formatVolume(max)}`;
}

/** Highest commission rate among the tiers, formatted; "40%" when empty. */
export function topTierRate(tiers: PartnerTier[]): string {
  if (tiers.length === 0) return '40%';
  return formatRate(Math.max(...tiers.map((t) => t.commissionRate)));
}

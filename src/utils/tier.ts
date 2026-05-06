import type { PartnerTier } from '#/services/apis/partner/types';

export function formatRate(rate: number): string {
  return `${Math.floor(rate * 100)}%`;
}

export function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${Math.floor(v / 100_000) / 10}M`;
  if (v >= 1_000) return `$${Math.floor(v / 1_000)}K`;
  return `$${Math.floor(v)}`;
}

export function formatVolumeRange(min: number, max: number | null): string {
  if (max == null) return `${formatVolume(min)}+`;
  return `${formatVolume(min)} – ${formatVolume(max)}`;
}

export function topTierRate(tiers: PartnerTier[]): string {
  if (tiers.length === 0) return '';
  return formatRate(Math.max(...tiers.map((t) => t.commissionRate)));
}

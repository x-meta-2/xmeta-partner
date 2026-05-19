import type { PartnerTier } from '#/services/apis/partner/types';

const TIER_IMAGE_BY_NAME: Record<string, string> = {
  standard: '/assets/images/landing/standart.png',
  bronze: '/assets/images/landing/bronze.png',
  silver: '/assets/images/landing/silver.png',
  gold: '/assets/images/landing/gold.png',
  diamond: '/assets/images/landing/diamond.png',
};

export function getTierImageSrc(name?: string | null): string {
  if (!name) return TIER_IMAGE_BY_NAME.standard;
  return (
    TIER_IMAGE_BY_NAME[name.trim().toLowerCase()] ?? TIER_IMAGE_BY_NAME.standard
  );
}

const TIER_VIDEO_BY_NAME: Record<string, string> = {
  standard: '/assets/images/TransferNow/standart.mp4',
  bronze: '/assets/images/TransferNow/bronze.mp4',
  silver: '/assets/images/TransferNow/silver.mp4',
  gold: '/assets/images/TransferNow/gold.mp4',
  diamond: '/assets/images/TransferNow/diamond.mp4',
};

export function getTierVideoSrc(name?: string | null): string {
  if (!name) return TIER_VIDEO_BY_NAME.standard;
  return (
    TIER_VIDEO_BY_NAME[name.trim().toLowerCase()] ?? TIER_VIDEO_BY_NAME.standard
  );
}

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

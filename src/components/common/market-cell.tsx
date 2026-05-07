const COIN_CDN = 'https://cdn.x-meta.com/config/coins';

function parseMarketId(marketId: string) {
  const stripped = marketId.replace(/^perp\./, '');
  const parts = stripped.split('_');
  if (parts.length !== 2) return { base: stripped, pair: stripped.toUpperCase() };
  const [base, quote] = parts;
  return { base, pair: `${base}${quote}`.toUpperCase() };
}

interface MarketCellProps {
  marketId: string;
  size?: 'sm' | 'md';
}

export function MarketCell({ marketId, size = 'md' }: MarketCellProps) {
  const { base, pair } = parseMarketId(marketId);
  const iconSize = size === 'sm' ? 'size-4' : 'size-5';

  return (
    <span className="inline-flex items-center gap-1.5">
      <img
        src={`${COIN_CDN}/${base}.png`}
        alt={base}
        className={`${iconSize} rounded-full`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <span className="font-mono text-xs">{pair}</span>
    </span>
  );
}

import { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import type { ReferralLink } from '#/services/apis/partner/links';
import { copyToClipboard } from '#/utils/clipboard';
import { formatDate } from '#/utils/date';
import { formatCount } from '#/utils';

function LinkActions({ link }: { link: ReferralLink }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const ok = await copyToClipboard(link.url, 'Link copied');
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Button size="icon" variant="ghost" onClick={copy} aria-label="Copy link">
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => window.open(link.url, '_blank')}
        aria-label="Open link"
      >
        <ExternalLink className="size-4" />
      </Button>
    </div>
  );
}

export const linksColumns: ColumnDef<ReferralLink>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs font-semibold text-primary">
          {row.original.code}
        </span>
        {!row.original?.isActive && (
          <Badge variant="secondary" className="text-[10px]">
            Inactive
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => (
      <span className="block max-w-xs truncate font-mono text-xs text-muted-foreground">
        {row.original.url}
      </span>
    ),
  },
  {
    accessorKey: 'registrations',
    header: () => <div className="text-right">Registrations</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatCount(row.original.registrations)}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <LinkActions link={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];

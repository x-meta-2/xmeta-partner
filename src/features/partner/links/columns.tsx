import { useState } from 'react';
import { Check, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '#/components/ui/button';
import { StatusTag } from '#/components/common/status-tag';
import type { ReferralLink } from '#/services/types/partner.types';

const num = (v: number) => v.toLocaleString('en-US');
const formatDate = (iso: string) => new Date(iso).toISOString().slice(0, 10);

function LinkActions({ link }: { link: ReferralLink }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(link.url);
    setCopied(true);
    toast.success('Link copied');
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
      <Button
        size="icon"
        variant="ghost"
        onClick={() => toast.info('Delete link (Phase 3.5)')}
        aria-label="Delete link"
        className="text-destructive hover:bg-destructive-soft hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

export const linksColumns: ColumnDef<ReferralLink>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-primary">
        {row.original.code}
      </span>
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
    accessorKey: 'clicks',
    header: () => <div className="text-right">Clicks</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{num(row.original.clicks)}</div>
    ),
  },
  {
    accessorKey: 'registrations',
    header: () => <div className="text-right">Registrations</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {num(row.original.registrations)}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusTag status={row.original.status} />,
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

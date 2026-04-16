import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link2, MousePointerClick, Plus, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { BaseTable, DataTableHeader } from '#/components/data-table';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import { PageHeader } from '#/components/common/page-header';
import { mockLinks } from '#/features/partner/mock';
import { linksColumns } from './columns';

const num = (v: number) => v.toLocaleString('en-US');

export function PartnerLinksPage() {
  const { data: links = mockLinks } = useQuery({
    queryKey: ['partner', 'links'],
    queryFn: () => Promise.resolve(mockLinks),
  });

  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');

  const totalClicks = links.reduce((a, l) => a + l.clicks, 0);
  const totalReg = links.reduce((a, l) => a + l.registrations, 0);

  const submit = () => {
    if (!code.trim()) {
      toast.error('Code is required');
      return;
    }
    toast.success(`Link "${code.toUpperCase()}" created (mock)`);
    setOpen(false);
    setCode('');
  };

  const createButton = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" /> Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Referral Link</DialogTitle>
          <DialogDescription>
            Enter a unique code for your new referral link.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <label className="text-sm font-medium">Link Code</label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g., TWITTER-2026"
          />
          <div className="text-xs text-muted-foreground">
            Your link will be:{' '}
            <span className="font-mono text-foreground">
              https://x-meta.com/ref/{code || 'CODE'}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Create Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Links" description="Manage your referral links" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Links" value={num(links.length)} icon={Link2} />
        <StatCard
          label="Total Clicks"
          value={num(totalClicks)}
          icon={MousePointerClick}
        />
        <StatCard
          label="Total Registrations"
          value={num(totalReg)}
          icon={UserPlus}
        />
      </div>

      <BaseTable
        data={links}
        columns={linksColumns}
        rowKey="id"
        header={
          <DataTableHeader
            title="Referral Links"
            description="Create and manage referral URLs for different channels"
            action={createButton}
          />
        }
        toolbar={{
          searchKey: 'code',
          searchPlaceholder: 'Search by code…',
        }}
      />
    </div>
  );
}

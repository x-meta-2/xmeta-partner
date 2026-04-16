import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, Network, UserCheck, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { BaseTable, DataTableHeader } from '#/components/data-table';
import { Card } from '#/components/ui/card';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import { PageHeader } from '#/components/common/page-header';
import {
  mockSubAffiliateStats,
  mockSubAffiliates,
} from '#/features/partner/mock';
import { subAffiliatesColumns } from './columns';

const money = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
];

export function PartnerSubAffiliatesPage() {
  const [email, setEmail] = useState('');

  const { data: stats = mockSubAffiliateStats } = useQuery({
    queryKey: ['partner', 'sub-affiliates', 'stats'],
    queryFn: () => Promise.resolve(mockSubAffiliateStats),
  });
  const { data: rows = mockSubAffiliates } = useQuery({
    queryKey: ['partner', 'sub-affiliates', 'list'],
    queryFn: () => Promise.resolve(mockSubAffiliates),
  });

  const invite = () => {
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }
    toast.success(`Invite sent to ${email} (mock)`);
    setEmail('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sub-Affiliates"
        description="Partners you brought in — you earn 10% override on their commissions."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total" value={stats.total.toString()} icon={Network} />
        <StatCard label="Active" value={stats.active.toString()} icon={UserCheck} />
        <StatCard
          label="Override Earned"
          value={money(stats.overrideEarned)}
          icon={DollarSign}
        />
      </div>

      <Card className="gap-4 p-5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <UserPlus className="size-4" /> Invite a sub-affiliate
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="partner@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-md"
          />
          <Button onClick={invite}>Send Invite</Button>
        </div>
      </Card>

      <BaseTable
        data={rows}
        columns={subAffiliatesColumns}
        rowKey="id"
        header={
          <DataTableHeader
            title="Sub-Affiliate Network"
            description="Performance of everyone in your network"
          />
        }
        toolbar={{
          searchKey: 'email',
          searchPlaceholder: 'Search by email…',
          filters: [
            { columnId: 'status', title: 'Status', options: STATUS_OPTIONS },
          ],
        }}
      />
    </div>
  );
}

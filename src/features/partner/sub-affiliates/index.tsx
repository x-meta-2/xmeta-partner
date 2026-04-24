import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DollarSign, Network, UserCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { PageHeader } from '#/components/common/page-header';
import { BaseTable, DataTableHeader } from '#/components/data-table';
import { Button } from '#/components/ui/button';
import { Card } from '#/components/ui/card';
import { Input } from '#/components/ui/input';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import {
  getSubAffiliateStats,
  inviteSubAffiliate,
  listSubAffiliates,
} from '#/services/apis/partner/sub-affiliates';

import { subAffiliatesColumns } from './columns';

const money = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
];

export function PartnerSubAffiliatesPage() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');

  const statsQuery = useQuery({
    queryKey: ['partner', 'sub-affiliates', 'stats'],
    queryFn: getSubAffiliateStats,
  });
  const listQuery = useQuery({
    queryKey: ['partner', 'sub-affiliates', 'list'],
    queryFn: () => listSubAffiliates({ current: 1, pageSize: 50 }),
  });

  const inviteMutation = useMutation({
    mutationFn: inviteSubAffiliate,
    onSuccess: () => {
      toast.success(`Invite sent to ${email}`);
      queryClient.invalidateQueries({ queryKey: ['partner', 'sub-affiliates'] });
      setEmail('');
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to send invite');
    },
  });

  const stats = statsQuery.data;
  const rows = listQuery.data?.items ?? [];

  const invite = () => {
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }
    inviteMutation.mutate({ email: email.trim() });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sub-Affiliates"
        description="Partners you brought in — you earn 10% override on their commissions."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total"
          value={(stats?.total ?? 0).toString()}
          icon={Network}
        />
        <StatCard
          label="Active"
          value={(stats?.active ?? 0).toString()}
          icon={UserCheck}
        />
        <StatCard
          label="Override Earned"
          value={money(stats?.overrideEarned ?? 0)}
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
          <Button onClick={invite} disabled={inviteMutation.isPending}>
            {inviteMutation.isPending ? 'Sending…' : 'Send Invite'}
          </Button>
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
          searchKey: 'name',
          searchPlaceholder: 'Search by name…',
          filters: [
            { columnId: 'status', title: 'Status', options: STATUS_OPTIONS },
          ],
        }}
      />
    </div>
  );
}

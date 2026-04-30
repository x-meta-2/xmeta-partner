import { useQuery } from '@tanstack/react-query';
import { Activity, Eye, Target, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';

import { PageHeader } from '#/components/common/page-header';
import { BaseTable, DataTableHeader } from '#/components/data-table';
import { Button } from '#/components/ui/button';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import {
  getReferralStats,
  listReferrals,
  type Referral,
} from '#/services/apis/partner/referrals';

import { referralsColumns } from './columns';
import { ReferralDetailDrawer } from './referral-detail-drawer';

const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export function PartnerReferralsPage() {
  const [selected, setSelected] = useState<Referral | null>(null);

  const statsQuery = useQuery({
    queryKey: ['partner', 'referrals', 'stats'],
    queryFn: getReferralStats,
  });
  const listQuery = useQuery({
    queryKey: ['partner', 'referrals', 'list'],
    queryFn: () => listReferrals({ current: 1, pageSize: 50 }),
  });

  const stats = statsQuery.data;
  const referrals = listQuery.data?.items ?? [];
  const total = listQuery.data?.total ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referrals"
        description="Track your referred users and their activity"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Referrals"
          value={(stats?.total ?? 0).toString()}
          icon={Users}
          isLoading={statsQuery.isLoading}
        />
        <StatCard
          label="Deposited"
          value={(stats?.deposited ?? 0).toString()}
          icon={UserCheck}
          isLoading={statsQuery.isLoading}
        />
        <StatCard
          label="Active"
          value={(stats?.active ?? 0).toString()}
          icon={Activity}
          isLoading={statsQuery.isLoading}
        />
        <StatCard
          label="Inactive"
          value={(stats?.inactive ?? 0).toString()}
          icon={Target}
          isLoading={statsQuery.isLoading}
        />
      </div>

      <BaseTable
        data={referrals}
        columns={referralsColumns}
        rowKey="id"
        isLoading={listQuery.isLoading}
        rowActions={(row) => (
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setSelected(row)}
            aria-label="View referral details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        header={
          <DataTableHeader
            title={`All Referrals (${total})`}
            description="Search and filter your referred users"
          />
        }
        toolbar={{
          searchKey: 'userId',
          searchPlaceholder: 'Search by user ID...',
          filters: [
            { columnId: 'status', title: 'Status', options: STATUS_OPTIONS },
          ],
        }}
      />

      <ReferralDetailDrawer
        referral={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

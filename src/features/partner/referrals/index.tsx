import { useQuery } from '@tanstack/react-query';
import { Activity, Target, UserCheck, Users } from 'lucide-react';

import { PageHeader } from '#/components/common/page-header';
import { BaseTable, DataTableHeader } from '#/components/data-table';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import {
  getReferralStats,
  listReferrals,
} from '#/services/apis/partner/referrals';

import { referralsColumns } from './columns';

const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export function PartnerReferralsPage() {
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
        />
        <StatCard
          label="Verified (KYC)"
          value={(stats?.verified ?? 0).toString()}
          icon={UserCheck}
        />
        <StatCard
          label="Active"
          value={(stats?.active ?? 0).toString()}
          icon={Activity}
        />
        <StatCard
          label="Conversion Rate"
          value={`${stats?.conversionRate ?? 0}%`}
          icon={Target}
        />
      </div>

      <BaseTable
        data={referrals}
        columns={referralsColumns}
        rowKey="id"
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
    </div>
  );
}

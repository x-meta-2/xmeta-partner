import { useQuery } from '@tanstack/react-query';
import { Activity, Target, UserCheck, Users } from 'lucide-react';

import { BaseTable, DataTableHeader } from '#/components/data-table';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import { PageHeader } from '#/components/common/page-header';
import { mockReferralStats, mockReferrals } from '#/features/partner/mock';
import { referralsColumns } from './columns';

const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
];

export function PartnerReferralsPage() {
  const { data: stats = mockReferralStats } = useQuery({
    queryKey: ['partner', 'referrals', 'stats'],
    queryFn: () => Promise.resolve(mockReferralStats),
  });
  const { data: referrals = mockReferrals } = useQuery({
    queryKey: ['partner', 'referrals', 'list'],
    queryFn: () => Promise.resolve(mockReferrals),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referrals"
        description="Track your referred users and their activity"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Referrals" value={stats.total.toString()} icon={Users} />
        <StatCard label="Verified (KYC)" value={stats.verified.toString()} icon={UserCheck} />
        <StatCard label="Active" value={stats.active.toString()} icon={Activity} />
        <StatCard
          label="Conversion Rate"
          value={`${stats.conversionRate}%`}
          icon={Target}
        />
      </div>

      <BaseTable
        data={referrals}
        columns={referralsColumns}
        rowKey="id"
        header={
          <DataTableHeader
            title={`All Referrals (${referrals.length})`}
            description="Search and filter your referred users"
          />
        }
        toolbar={{
          searchKey: 'email',
          searchPlaceholder: 'Search by user ID or email...',
          filters: [
            { columnId: 'status', title: 'Status', options: STATUS_OPTIONS },
          ],
        }}
      />
    </div>
  );
}

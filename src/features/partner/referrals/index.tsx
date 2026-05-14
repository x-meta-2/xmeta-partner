import { useQuery } from '@tanstack/react-query';
import { Activity, Eye, Target, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';

import { PageHeader } from '#/components/common/page-header';
import { BaseTable, DataTableHeader } from '#/components/data-table';
import { Button } from '#/components/ui/button';
import { useI18n } from '#/i18n/context';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import {
  getReferralStats,
  listReferrals,
  type Referral,
} from '#/services/apis/partner/referrals';

import { getReferralsColumns } from './columns';
import { ReferralDetailDrawer } from './referral-detail-drawer';

export function PartnerReferralsPage() {
  const { t } = useI18n();
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('partner:referrals.title')}
        description={t('partner:referrals.description')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t('partner:referrals.total')}
          value={(stats?.total ?? 0).toString()}
          icon={Users}
          isLoading={statsQuery.isLoading}
        />
        <StatCard
          label={t('partner:referrals.deposit')}
          value={(stats?.registered ?? 0).toString()}
          icon={UserCheck}
          isLoading={statsQuery.isLoading}
        />
        <StatCard
          label={t('partner:referrals.active')}
          value={(stats?.active ?? 0).toString()}
          icon={Activity}
          isLoading={statsQuery.isLoading}
        />
        <StatCard
          label={t('partner:referrals.inactive')}
          value={(stats?.inactive ?? 0).toString()}
          icon={Target}
          isLoading={statsQuery.isLoading}
        />
      </div>

      <BaseTable
        data={referrals}
        columns={getReferralsColumns(t)}
        rowKey="id"
        isLoading={listQuery.isLoading}
        rowActions={(row) => (
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setSelected(row)}
            aria-label={t('partner:referrals.view')}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        header={
          <DataTableHeader
            title={t('partner:referrals.allTitle')}
            description={t('partner:referrals.allDescription')}
          />
        }
        toolbar={{
          searchKey: 'userId',
          searchPlaceholder: t('partner:referrals.search'),
          filters: [
            { columnId: 'status', title: t('partner:referrals.col.status'), options: [
              { label: t('partner:status.active'), value: 'active' },
              { label: t('partner:status.inactive'), value: 'inactive' },
            ] },
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

import type { MenuConfig } from '../services';

export const dashboardMenuConfig: MenuConfig = [
  {
    id: 'overview',
    label: 'Dashboard',
    icon: 'LayoutGrid',
    to: '/dashboard/overview',
  },
  {
    id: 'referrals',
    label: 'Referrals',
    icon: 'Users',
    to: '/dashboard/referrals',
  },
  {
    id: 'links',
    label: 'Referral Links',
    icon: 'Link',
    to: '/dashboard/links',
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    icon: 'Megaphone',
    to: '/dashboard/campaigns',
  },
  {
    id: 'earnings',
    label: 'Earnings',
    icon: 'DollarSign',
    to: '/dashboard/earnings',
  },
  {
    id: 'payouts',
    label: 'Payouts',
    icon: 'Banknote',
    to: '/dashboard/payouts',
  },
  {
    id: 'sub-affiliates',
    label: 'Sub-Affiliates',
    icon: 'Network',
    to: '/dashboard/sub-affiliates',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    to: '/dashboard/settings',
  },
];

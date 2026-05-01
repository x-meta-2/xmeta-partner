export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  to?: string;
  children?: MenuItem[];
  badge?: number | string;
}

export type MenuConfig = MenuItem[];

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
    id: 'performance',
    label: 'Performance',
    icon: 'BarChart3',
    to: '/dashboard/performance',
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
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    to: '/dashboard/settings',
  },
];

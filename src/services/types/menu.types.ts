export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  to?: string;
  children?: MenuItem[];
  badge?: number | string;
}

export type MenuConfig = MenuItem[];

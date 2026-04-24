export type CampaignStatus = 'active' | 'paused' | 'ended';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  link: string;
  code: string;
  clicks: number;
  signups: number;
  conversions: number;
  commission: number;
  status: CampaignStatus;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

import {
  Award,
  CircleDollarSign,
  Headset,
  Infinity as InfinityIcon,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Stat {
  value: string;
  label: string;
}

export const landingStats: Stat[] = [
  { value: '100,000+', label: 'Total Partners' },
  { value: '$15M+', label: 'Avg. Monthly Commission' },
  { value: '170+', label: 'Countries Reached' },
];

export interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const landingBenefits: Benefit[] = [
  {
    icon: CircleDollarSign,
    title: 'Up to 40% Commission Rate',
    description:
      'Industry-leading tiered commission rates — the more active clients and volume you bring, the higher your share.',
  },
  {
    icon: TrendingUp,
    title: 'Industry-Leading Products',
    description:
      'World-class liquidity, lightning-fast execution and tight spreads on Spot, Futures and Earn.',
  },
  {
    icon: InfinityIcon,
    title: 'Lifetime Commissions',
    description:
      'Earn recurring commissions from every trade your referrals make — for as long as they trade.',
  },
  {
    icon: Sparkles,
    title: 'Partner-Exclusive Events',
    description:
      'Regular campaigns, contests and rewards to supercharge your referral earnings.',
  },
  {
    icon: Headset,
    title: 'Dedicated Account Manager',
    description:
      '24/7 expert support to help you grow and unlock bigger opportunities for your audience.',
  },
  {
    icon: Award,
    title: 'Global Brand, Local Support',
    description:
      'Reach audiences in 170+ countries with localised materials and multi-language support.',
  },
];

export interface CommissionTier {
  name: string;
  rate: string;
  activeClients: string;
  tradingVolume: string;
  color: string;
}

export const commissionTiers: CommissionTier[] = [
  {
    name: 'Standard',
    rate: '20%',
    activeClients: '0+',
    tradingVolume: '$0 – $15M',
    color: 'text-muted-foreground',
  },
  {
    name: 'Bronze',
    rate: '25%',
    activeClients: '1+',
    tradingVolume: '$15M – $30M',
    color: 'text-amber-700',
  },
  {
    name: 'Silver',
    rate: '30%',
    activeClients: '3+',
    tradingVolume: '$30M – $150M',
    color: 'text-slate-400',
  },
  {
    name: 'Gold',
    rate: '35%',
    activeClients: '8+',
    tradingVolume: '$150M – $450M',
    color: 'text-yellow-500',
  },
  {
    name: 'Diamond',
    rate: '40%',
    activeClients: '10+',
    tradingVolume: '$450M+',
    color: 'text-cyan-400',
  },
];

export interface Step {
  number: string;
  title: string;
  description: string;
}

export const landingSteps: Step[] = [
  {
    number: '01',
    title: 'Apply to Become an X-Meta Partner',
    description:
      'Complete and submit your application. The X-Meta team will review and, once approved, you can start promoting.',
  },
  {
    number: '02',
    title: 'Get Your Exclusive Referral Code',
    description:
      'A unique 7-character referral code is generated for you automatically. Create up to 3 codes to track different channels.',
  },
  {
    number: '03',
    title: 'Invite Users & Earn Lifetime Commissions',
    description:
      'Share your code and referral link — you earn ongoing commissions for every trade your referrals make.',
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const landingFaqs: Faq[] = [
  {
    question: 'What is the X-Meta Partner Program?',
    answer:
      'The X-Meta Partner Program is an affiliate program that rewards content creators, influencers, traders and communities for bringing new users to the X-Meta exchange. Partners earn a share of every trading fee their referred users generate — for life.',
  },
  {
    question: 'How are commission tiers determined?',
    answer:
      'Your tier depends on two factors: the number of active clients you refer (users who traded futures in the last 120 days) and their total trading volume. As both metrics grow, you automatically advance to higher tiers with better commission rates.',
  },
  {
    question: 'Who is eligible to join the program?',
    answer:
      'Anyone with an active audience or community is eligible — crypto influencers, YouTubers, Telegram groups, traders and blog owners. You must pass our brief KYC/compliance review after applying.',
  },
  {
    question: 'Is there a fee to join the Partner Program?',
    answer:
      'No. The X-Meta Partner Program is completely free to join. There are no upfront costs, no monthly fees and no minimum volume requirements to start earning.',
  },
  {
    question: 'How do referral codes work?',
    answer:
      'When you join, a unique 7-character referral code is generated automatically. You can create up to 3 codes total to track different promotion channels. Codes are permanent and cannot be edited or deleted.',
  },
  {
    question: 'When is a referred user considered "active"?',
    answer:
      'A referred user is considered active if they have made at least one futures trade within the last 120 days. Inactive users do not count toward your active client tier requirements.',
  },
];

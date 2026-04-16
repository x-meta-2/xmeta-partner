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
    title: 'Up to 50% Commission Rate',
    description:
      'Industry-leading tiered commission rates — the more you refer, the higher your share.',
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
  threshold: string;
  rate: string;
}

export const commissionTiers: CommissionTier[] = [
  { name: 'Bronze', threshold: 'Starting tier', rate: '30%' },
  { name: 'Silver', threshold: '$100K monthly vol.', rate: '35%' },
  { name: 'Gold', threshold: '$500K monthly vol.', rate: '40%' },
  { name: 'Platinum', threshold: '$2M monthly vol.', rate: '45%' },
  { name: 'Diamond', threshold: '$5M monthly vol.', rate: '50%' },
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
      'Generate a unique referral code in your dashboard, then invite users. Their activity is tracked automatically.',
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
    question: 'How do I apply to become an X-Meta Partner?',
    answer:
      'Click "Apply Now" on this page, fill out the short application form with your audience details and submit. Our partner team typically reviews applications within 2–3 business days.',
  },
  {
    question: 'Why did X-Meta create the Partner Program?',
    answer:
      'We built the Partner Program to recognise the communities and creators who trust X-Meta and help us reach new traders worldwide. The program is a long-term commitment to sharing our growth with the people who grow with us.',
  },
];

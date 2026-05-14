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

export const getLandingStats = (t: (key: string) => string): Stat[] => [
  { value: t('landing:stats.partners.value'), label: t('landing:stats.partners.label') },
  { value: t('landing:stats.commission.value'), label: t('landing:stats.commission.label') },
  { value: t('landing:stats.countries.value'), label: t('landing:stats.countries.label') },
];

export interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const getLandingBenefits = (t: (key: string) => string): Benefit[] => [
  {
    icon: CircleDollarSign,
    title: t('landing:benefit.commission.title'),
    description: t('landing:benefit.commission.description'),
  },
  {
    icon: TrendingUp,
    title: t('landing:benefit.products.title'),
    description: t('landing:benefit.products.description'),
  },
  {
    icon: InfinityIcon,
    title: t('landing:benefit.lifetime.title'),
    description: t('landing:benefit.lifetime.description'),
  },
  {
    icon: Sparkles,
    title: t('landing:benefit.events.title'),
    description: t('landing:benefit.events.description'),
  },
  {
    icon: Headset,
    title: t('landing:benefit.manager.title'),
    description: t('landing:benefit.manager.description'),
  },
  {
    icon: Award,
    title: t('landing:benefit.global.title'),
    description: t('landing:benefit.global.description'),
  },
];

export interface Step {
  number: string;
  title: string;
  description: string;
}

export const getLandingSteps = (t: (key: string) => string): Step[] => [
  {
    number: t('landing:step1.number'),
    title: t('landing:step1.title'),
    description: t('landing:step1.description'),
  },
  {
    number: t('landing:step2.number'),
    title: t('landing:step2.title'),
    description: t('landing:step2.description'),
  },
  {
    number: t('landing:step3.number'),
    title: t('landing:step3.title'),
    description: t('landing:step3.description'),
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const getLandingFaqs = (t: (key: string) => string): Faq[] => [
  {
    question: t('landing:faq.q1'),
    answer: t('landing:faq.a1'),
  },
  {
    question: t('landing:faq.q2'),
    answer: t('landing:faq.a2'),
  },
  {
    question: t('landing:faq.q3'),
    answer: t('landing:faq.a3'),
  },
  {
    question: t('landing:faq.q4'),
    answer: t('landing:faq.a4'),
  },
  {
    question: t('landing:faq.q5'),
    answer: t('landing:faq.a5'),
  },
  {
    question: t('landing:faq.q6'),
    answer: t('landing:faq.a6'),
  },
];

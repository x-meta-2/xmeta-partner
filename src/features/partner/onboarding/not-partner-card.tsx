import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion';
import { Button } from '#/components/ui/button';
import { Card } from '#/components/ui/card';
import { Separator } from '#/components/ui/separator';
import { useLocalizedNavigate } from '#/hooks/use-localized-navigate';
import { motion } from 'framer-motion';
import {
  Award,
  CircleAlert,
  DollarSign,
  LucideMoveRight,
  Minus,
  Plus,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const FAQ_ITEMS = [
  {
    id: 'q1',
    q: 'How do I become a partner?',
    a: 'Submit an application with your company and promotion details. Our team reviews every application within 2-3 business days.',
  },
  {
    id: 'q2',
    q: 'What commission do I earn?',
    a: 'Bronze tier starts at 20% commission. As your referral volume grows you unlock Silver (25%), Gold (30%) and Diamond (35%) tiers.',
  },
  {
    id: 'q3',
    q: 'How often am I paid?',
    a: 'Payouts are processed monthly in USDT. The minimum payout threshold is $10.',
  },
];

export function NotPartnerCard() {
  const navigate = useLocalizedNavigate();
  const [expandedId, setExpandedId] = useState<string | undefined>(undefined);
  const [isXl, setIsXl] = useState(false);

  useEffect(() => {
    const checkXl = () => setIsXl(window.innerWidth >= 1280);
    checkXl();
    window.addEventListener('resize', checkXl);
    return () => window.removeEventListener('resize', checkXl);
  }, []);

  return (
    <div className="flex h-fit flex-col gap-4 xl:flex-row">
      <motion.div layout className="min-w-0 flex-1">
        <Card className="h-full p-0 pt-0">
          <div className="relative flex h-full flex-col gap-6 overflow-hidden rounded-xl bg-gradient-to-br from-[#fffbeb] via-white to-white p-8 dark:from-[#2c2a1f] dark:via-[#1a1a1a] dark:to-[#1a1a1a]">
            <div className="absolute left-0 top-0 h-32 w-full bg-gradient-to-br from-white/60 via-transparent to-transparent dark:from-white/5" />

            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-full bg-yellow-100 p-2.5 dark:bg-yellow-900/30">
                <CircleAlert
                  className="text-yellow-600 dark:text-yellow-500"
                  size={24}
                />
              </div>
              <h3 className="text-xl font-semibold">Become a Partner</h3>
            </div>

            <p className="leading-relaxed text-muted-foreground">
              You are not a partner yet. Submit an application to start earning
              commissions by referring users to xmeta — up to 35% of their
              trading fees.
            </p>

            <Button
              variant="outline"
              className="w-fit px-6 py-5.5 text-base"
              onClick={() => navigate('/dashboard/apply')}
            >
              Apply to become a Partner
              <LucideMoveRight className="ml-2" />
            </Button>

            <Separator className="my-2" />

            <div className="flex flex-col gap-2">
              <h3 className="text-md font-medium">What you&apos;ll need</h3>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" />
                Your application is reviewed within 2-3 business days
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="flex items-center gap-3 text-[13.5px] text-muted-foreground">
                <Users className="size-5" /> Company or personal brand details
              </h4>
              <h4 className="flex items-center gap-3 text-[13.5px] text-muted-foreground">
                <Award className="size-5" /> Social presence (Facebook /
                Instagram)
              </h4>
              <h4 className="flex items-center gap-3 text-[13.5px] text-muted-foreground">
                <TrendingUp className="size-5" /> A short promotion plan
              </h4>
            </div>

            <div className="mt-auto pt-4">
              <h4 className="mb-3 font-medium">Benefits</h4>
              <div className="flex flex-col gap-3">
                <Benefit
                  icon={<DollarSign className="size-4 text-primary" />}
                  label="Earn 20-35% of your referrals' trading fees"
                />
                <Benefit
                  icon={<Award className="size-4 text-primary" />}
                  label="Unlock higher tiers as your network grows"
                />
                <Benefit
                  icon={<TrendingUp className="size-4 text-primary" />}
                  label="Track performance with real-time analytics"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="w-full xl:w-fit">
        <motion.div
          layout
          initial={false}
          animate={{ width: isXl ? (expandedId ? 520 : 340) : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="h-full w-full xl:w-fit"
        >
          <Card className="h-full w-full p-6 xl:w-fit">
            <h3 className="mb-2 text-xl font-semibold">FAQ</h3>
            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={expandedId}
              onValueChange={setExpandedId}
            >
              {FAQ_ITEMS.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                >
                  <AccordionTrigger className="group/trigger py-4 text-left text-[14.5px] font-medium text-gray-700 hover:no-underline dark:text-gray-200">
                    <span className="pr-4">{item.q}</span>
                    <Plus className="size-5 shrink-0 text-gray-400 group-aria-expanded/trigger:hidden" />
                    <Minus className="hidden size-5 shrink-0 text-gray-400 group-aria-expanded/trigger:block" />
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pr-4 text-[14px] leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function Benefit({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

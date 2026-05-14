import { motion } from 'framer-motion';
import {
  ExternalLink,
  FileCheck,
  ScanFace,
  ShieldCheck,
  SquareUser,
} from 'lucide-react';

import { Card } from '#/components/ui/card';
import { Separator } from '#/components/ui/separator';
import { useI18n } from '#/i18n/context';

export function NotVerifiedCard() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10">
      <motion.div layout className="w-full max-w-3xl">
        <Card className="p-0 pt-0">
          <div className="relative flex flex-col gap-7 overflow-hidden rounded-xl bg-gradient-to-br from-[#fffbeb] via-white to-white p-8 sm:p-10 dark:from-[#2c2a1f] dark:via-[#1a1a1a] dark:to-[#1a1a1a]">
            <div className="absolute left-0 top-0 h-36 w-full bg-gradient-to-br from-white/60 via-transparent to-transparent dark:from-white/5" />

            <div className="flex items-center gap-4">
              <div className="shrink-0 rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                <ShieldCheck
                  className="text-yellow-600 dark:text-yellow-500"
                  size={28}
                />
              </div>
              <h3 className="text-2xl font-semibold sm:text-3xl">
                {t('partner:onboarding.notVerified.title')}
              </h3>
            </div>

            <p className="max-w-xl leading-relaxed text-muted-foreground">
              {t('partner:onboarding.notVerified.description')}
            </p>

            <a
              href="https://www.x-meta.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-input bg-background px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              {t('partner:onboarding.notVerified.goToXmeta')}
              <ExternalLink className="size-4" />
            </a>

            <Separator />

            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">{t('partner:onboarding.notVerified.required')}</h4>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4" />
                {t('partner:onboarding.notVerified.note')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h5 className="flex items-center gap-3 text-sm text-muted-foreground">
                <SquareUser className="size-5" /> {t('partner:onboarding.notVerified.id')}
              </h5>
              <h5 className="flex items-center gap-3 text-sm text-muted-foreground">
                <ScanFace className="size-5" /> {t('partner:onboarding.notVerified.face')}
              </h5>
              <h5 className="flex items-center gap-3 text-sm text-muted-foreground">
                <FileCheck className="size-5" /> {t('partner:onboarding.notVerified.info')}
              </h5>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

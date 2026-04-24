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

/**
 * NotVerifiedCard — shown when the authenticated xmeta user has not
 * completed KYC (kycLevel === 0). Partner application is gated behind
 * identity verification on the main xmeta site.
 */
export function NotVerifiedCard() {
  return (
    <div className="flex h-fit justify-center">
      <motion.div layout className="w-full max-w-2xl">
        <Card className="p-0 pt-0">
          <div className="relative flex flex-col gap-6 overflow-hidden rounded-xl bg-gradient-to-br from-[#fffbeb] via-white to-white p-8 dark:from-[#2c2a1f] dark:via-[#1a1a1a] dark:to-[#1a1a1a]">
            <div className="absolute left-0 top-0 h-32 w-full bg-gradient-to-br from-white/60 via-transparent to-transparent dark:from-white/5" />

            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-full bg-yellow-100 p-2.5 dark:bg-yellow-900/30">
                <ShieldCheck
                  className="text-yellow-600 dark:text-yellow-500"
                  size={24}
                />
              </div>
              <h3 className="text-xl font-semibold">Verify your identity</h3>
            </div>

            <p className="leading-relaxed text-muted-foreground">
              xmeta сайт дээрээ KYC-ээ баталгаажуулсны дараа та partner болох
              боломжтой.
            </p>

            <a
              href="https://www.x-meta.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-md border border-input bg-background px-6 py-3 text-base font-medium transition-colors hover:bg-muted"
            >
              Go to xmeta
              <ExternalLink className="size-4" />
            </a>

            <Separator className="my-2" />

            <div className="flex flex-col gap-2">
              <h3 className="text-md font-medium">Required to verify</h3>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" />
                Verification takes a few minutes on the main xmeta site
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="flex items-center gap-3 text-[13.5px] text-muted-foreground">
                <SquareUser className="size-5" /> Government-issued ID
              </h4>
              <h4 className="flex items-center gap-3 text-[13.5px] text-muted-foreground">
                <ScanFace className="size-5" /> Facial verification
              </h4>
              <h4 className="flex items-center gap-3 text-[13.5px] text-muted-foreground">
                <FileCheck className="size-5" /> Basic personal info
              </h4>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

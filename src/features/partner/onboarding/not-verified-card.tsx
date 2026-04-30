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

export function NotVerifiedCard() {
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
                Verify your identity
              </h3>
            </div>

            <p className="max-w-xl leading-relaxed text-muted-foreground">
              xmeta сайт дээрээ KYC-ээ баталгаажуулсны дараа та partner болох
              боломжтой.
            </p>

            <a
              href="https://www.x-meta.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-input bg-background px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              Go to xmeta
              <ExternalLink className="size-4" />
            </a>

            <Separator />

            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Required to verify</h4>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4" />
                Verification takes a few minutes on the main xmeta site
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h5 className="flex items-center gap-3 text-sm text-muted-foreground">
                <SquareUser className="size-5" /> Government-issued ID
              </h5>
              <h5 className="flex items-center gap-3 text-sm text-muted-foreground">
                <ScanFace className="size-5" /> Facial verification
              </h5>
              <h5 className="flex items-center gap-3 text-sm text-muted-foreground">
                <FileCheck className="size-5" /> Basic personal info
              </h5>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

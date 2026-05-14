import { useState } from 'react';
import { Check, Copy, Link2 } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Card } from '#/components/ui/card';
import { useI18n } from '#/i18n/context';
import { copyToClipboard } from '#/utils/clipboard';

interface ReferralLinkCardProps {
  code: string;
  referralCount: number;
}

export function ReferralLinkCard({
  code,
  referralCount,
}: ReferralLinkCardProps) {
  const { t } = useI18n();
  const url = `https://x-meta.com/ref/${code}`;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const ok = await copyToClipboard(url, 'Referral link copied');
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-center gap-2">
        <Link2 className="size-4 text-muted-foreground" />
        <div className="text-base font-medium">{t('partner:dashboard.referralLink.title')}</div>
      </div>
      <p className="text-xs text-muted-foreground">
        {t('partner:dashboard.referralLink.description')}
      </p>

      <div className="flex gap-2">
        <div className="flex-1 truncate rounded-lg border bg-muted/40 px-3 py-2.5 font-mono text-sm">
          {url}
        </div>
        <Button variant="outline" onClick={copy}>
          {copied ? (
            <>
              <Check className="size-4" /> {t('partner:dashboard.referralLink.copied')}
            </>
          ) : (
            <>
              <Copy className="size-4" /> {t('partner:dashboard.referralLink.copy')}
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="text-muted-foreground">
          {t('partner:dashboard.referralLink.referrals')}{' '}
          <span className="font-semibold text-foreground">{referralCount}</span>
        </span>
        <span className="text-muted-foreground">
          {t('partner:dashboard.referralLink.code')} <span className="font-semibold text-primary">{code}</span>
        </span>
      </div>
    </Card>
  );
}

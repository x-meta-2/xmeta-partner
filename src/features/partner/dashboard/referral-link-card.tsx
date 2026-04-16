import { useState } from 'react';
import { Card } from '#/components/ui/card';
import { Button } from '#/components/ui/button';
import { toast } from 'sonner';
import { Check, Copy, Link2 } from 'lucide-react';

interface ReferralLinkCardProps {
  code: string;
  referralCount: number;
}

export function ReferralLinkCard({ code, referralCount }: ReferralLinkCardProps) {
  const url = `https://x-meta.com/ref/${code}`;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Referral link copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-center gap-2">
        <Link2 className="size-4 text-muted-foreground" />
        <div className="text-base font-medium">Your Referral Link</div>
      </div>
      <p className="text-xs text-muted-foreground">
        Share this link with your audience to start earning commission.
      </p>

      <div className="flex gap-2">
        <div className="flex-1 truncate rounded-lg border bg-muted/40 px-3 py-2.5 font-mono text-sm">
          {url}
        </div>
        <Button variant="outline" onClick={copy}>
          {copied ? (
            <>
              <Check className="size-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="size-4" /> Copy
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="text-muted-foreground">
          Referrals:{' '}
          <span className="font-semibold text-foreground">{referralCount}</span>
        </span>
        <span className="text-muted-foreground">
          Code:{' '}
          <span className="font-semibold text-primary">
            {code}
          </span>
        </span>
      </div>
    </Card>
  );
}

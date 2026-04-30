import { XCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '#/components/ui/button';
import { Card } from '#/components/ui/card';

import { ApplyPartnerForm } from './apply-form';

interface Prefill {
  companyName?: string;
  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export function RejectedApplication({
  reason,
  prefill,
}: {
  reason?: string;
  prefill?: Prefill;
}) {
  const [reapplying, setReapplying] = useState(false);

  if (reapplying) {
    return <ApplyPartnerForm prefill={prefill} />;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Card className="gap-6 p-8 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive-soft text-destructive">
          <XCircle className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Application not approved</h2>
          {reason ? (
            <div className="rounded-md border border-destructive/20 bg-destructive-soft/40 p-3 text-left text-sm">
              <div className="mb-1 font-medium text-destructive">Reason</div>
              <div className="text-muted-foreground">{reason}</div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your application was not approved. You may reapply with additional
              information.
            </p>
          )}
        </div>
        <Button onClick={() => setReapplying(true)}>Reapply</Button>
      </Card>
    </div>
  );
}

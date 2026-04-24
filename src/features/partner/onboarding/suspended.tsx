import { AlertOctagon, LogOut } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Card } from '#/components/ui/card';
import { signOutAndReset } from '#/stores/auth-actions';

export function SuspendedPartner() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Card className="gap-6 p-8 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive-soft text-destructive">
          <AlertOctagon className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Account suspended</h2>
          <p className="text-sm text-muted-foreground">
            Your partner account has been suspended. Please contact support for
            more information.
          </p>
          <a
            href="mailto:support@x-meta.com"
            className="inline-block text-sm font-medium text-primary underline underline-offset-2"
          >
            support@x-meta.com
          </a>
        </div>
        <Button variant="outline" onClick={() => void signOutAndReset()}>
          <LogOut className="size-4" /> Sign out
        </Button>
      </Card>
    </div>
  );
}

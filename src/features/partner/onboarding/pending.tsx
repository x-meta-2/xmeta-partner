import { Clock, LogOut } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Card } from '#/components/ui/card';
import { useI18n } from '#/i18n/context';
import { signOutAndReset } from '#/stores/auth-actions';

export function PendingApplication({ submittedAt }: { submittedAt?: string }) {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Card className="gap-6 p-8 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-warning-soft text-warning">
          <Clock className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{t('partner:onboarding.pending.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('partner:onboarding.pending.description')}
          </p>
          {submittedAt && (
            <p className="text-xs text-muted-foreground">
              {t('partner:onboarding.pending.submitted')} {submittedAt.slice(0, 10)}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={() => void signOutAndReset()}>
          <LogOut className="size-4" /> {t('partner:onboarding.pending.signOut')}
        </Button>
      </Card>
    </div>
  );
}

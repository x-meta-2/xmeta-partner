import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog';
import { Input } from '#/components/ui/input';
import { requestPayout } from '#/services/apis/partner/payouts';
import { formatUSD } from '#/utils';

interface RequestPayoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingBalance: number;
  pendingCount: number;
}

export function RequestPayoutDialog({
  open,
  onOpenChange,
  pendingBalance,
  pendingCount,
}: RequestPayoutDialogProps) {
  const qc = useQueryClient();
  const [confirmText, setConfirmText] = useState('');

  const mutation = useMutation({
    mutationFn: requestPayout,
    onSuccess: () => {
      toast.success('Payout request created successfully');
      onOpenChange(false);
      setConfirmText('');
      qc.invalidateQueries({ queryKey: ['partner', 'payouts'] });
      qc.invalidateQueries({ queryKey: ['partner', 'commissions'] });
      qc.invalidateQueries({ queryKey: ['partner', 'dashboard'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to request payout');
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!mutation.isPending) {
          onOpenChange(v);
          if (!v) setConfirmText('');
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Payout</DialogTitle>
          <DialogDescription>
            You are about to request a payout of{' '}
            <span className="font-semibold text-foreground">
              {formatUSD(pendingBalance)}
            </span>{' '}
            from{' '}
            <span className="font-semibold text-foreground">
              {pendingCount}
            </span>{' '}
            pending commissions. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 pt-2">
          <label
            htmlFor="confirm-payout"
            className="text-sm text-muted-foreground"
          >
            Type{' '}
            <span className="font-semibold text-foreground">payout</span> to
            confirm
          </label>
          <Input
            id="confirm-payout"
            placeholder="payout"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoComplete="off"
          />
        </div>

        <DialogFooter showCloseButton closeButtonText="Cancel">
          <Button
            disabled={confirmText !== 'payout' || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="flex-1 rounded-full font-semibold py-2.5 h-auto"
          >
            {mutation.isPending ? 'Requesting…' : 'Confirm Payout'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

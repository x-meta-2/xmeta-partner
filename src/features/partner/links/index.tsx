import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link2, MousePointerClick, Plus, UserPlus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { BaseTable, DataTableHeader } from '#/components/data-table';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog';
import { Alert, AlertDescription } from '#/components/ui/alert';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import { PageHeader } from '#/components/common/page-header';
import { mockLinks } from '#/features/partner/mock';
import {
  REFERRAL_CODE_MAX_COUNT,
  REFERRAL_CODE_MIN_LENGTH,
  REFERRAL_CODE_MAX_LENGTH,
  validateReferralCode,
} from '#/services/types/partner.types';
import { linksColumns } from './columns';

const num = (v: number) => v.toLocaleString('en-US');

export function PartnerLinksPage() {
  const { data: links = mockLinks } = useQuery({
    queryKey: ['partner', 'links'],
    queryFn: () => Promise.resolve(mockLinks),
  });

  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  const totalClicks = links.reduce((a, l) => a + l.clicks, 0);
  const totalReg = links.reduce((a, l) => a + l.registrations, 0);
  const canCreate = links.length < REFERRAL_CODE_MAX_COUNT;

  const handleCodeChange = (value: string) => {
    const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCode(upper);
    if (upper.length > 0) {
      setCodeError(validateReferralCode(upper));
    } else {
      setCodeError(null);
    }
  };

  const submit = () => {
    const error = validateReferralCode(code);
    if (error) {
      setCodeError(error);
      return;
    }
    toast.success(`Link "${code}" created (mock)`);
    setOpen(false);
    setCode('');
    setCodeError(null);
  };

  const createButton = canCreate ? (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setCode(''); setCodeError(null); } }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" /> Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Referral Link</DialogTitle>
          <DialogDescription>
            Enter a unique code ({REFERRAL_CODE_MIN_LENGTH}-{REFERRAL_CODE_MAX_LENGTH} uppercase characters).
            You can create up to {REFERRAL_CODE_MAX_COUNT} links.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <label className="text-sm font-medium">Link Code</label>
          <Input
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="e.g., TRADE1"
            maxLength={REFERRAL_CODE_MAX_LENGTH}
          />
          {codeError && (
            <p className="text-xs text-destructive">{codeError}</p>
          )}
          <div className="text-xs text-muted-foreground">
            Your link will be:{' '}
            <span className="font-mono text-foreground">
              https://x-meta.com/ref/{code || 'CODE'}
            </span>
          </div>
          <Alert variant="default" className="border-muted">
            <AlertCircle className="size-4" />
            <AlertDescription className="text-xs">
              Referral links are permanent and cannot be edited or deleted after creation.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!code || !!codeError}>
            Create Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Button disabled>
      <Plus className="size-4" /> Max {REFERRAL_CODE_MAX_COUNT} Links
    </Button>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Links" description="Manage your referral links" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Links"
          value={`${links.length} / ${REFERRAL_CODE_MAX_COUNT}`}
          icon={Link2}
        />
        <StatCard
          label="Total Clicks"
          value={num(totalClicks)}
          icon={MousePointerClick}
        />
        <StatCard
          label="Total Registrations"
          value={num(totalReg)}
          icon={UserPlus}
        />
      </div>

      <BaseTable
        data={links}
        columns={linksColumns}
        rowKey="id"
        header={
          <DataTableHeader
            title="Referral Links"
            description="Links are permanent — create up to 3 unique codes"
            action={createButton}
          />
        }
        toolbar={{
          searchKey: 'code',
          searchPlaceholder: 'Search by code…',
        }}
      />
    </div>
  );
}

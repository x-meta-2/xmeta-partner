import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  Link2,
  MousePointerClick,
  Plus,
  UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '#/components/common/page-header';
import { BaseTable, DataTableHeader } from '#/components/data-table';
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert';
import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog';
import { Input } from '#/components/ui/input';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import {
  REFERRAL_CODE_MAX_COUNT,
  REFERRAL_CODE_MAX_LENGTH,
  REFERRAL_CODE_MIN_LENGTH,
  createReferralLink,
  listReferralLinks,
  validateReferralCode,
} from '#/services/apis/partner/links';
import { formatCount } from '#/utils';
import { linksColumns } from './columns';

export function PartnerLinksPage() {
  const queryClient = useQueryClient();
  const linksQuery = useQuery({
    queryKey: ['partner', 'links'],
    queryFn: () => listReferralLinks({ current: 1, pageSize: 50 }),
  });

  const links = linksQuery.data?.items ?? [];

  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createReferralLink,
    onSuccess: (data) => {
      if (data) toast.success(`Link "${data.code}" created`);
      queryClient.invalidateQueries({ queryKey: ['partner', 'links'] });
      setOpen(false);
      setCode('');
      setCodeError(null);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create link');
    },
  });

  const totalClicks = links.reduce((a, l) => a + l.clicks, 0);
  const totalReg = links.reduce((a, l) => a + l.registrations, 0);
  const canCreate = links.length < REFERRAL_CODE_MAX_COUNT;

  const handleCodeChange = (value: string) => {
    const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCode(upper);
    setCodeError(upper.length > 0 ? validateReferralCode(upper) : null);
  };

  const submit = () => {
    const error = validateReferralCode(code);
    if (error) {
      setCodeError(error);
      return;
    }
    createMutation.mutate({ code });
  };

  const createButton = canCreate ? (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setCode('');
          setCodeError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" /> Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Referral Link</DialogTitle>
          <DialogDescription>
            Enter a unique code ({REFERRAL_CODE_MIN_LENGTH}-
            {REFERRAL_CODE_MAX_LENGTH} uppercase characters). You can create up
            to {REFERRAL_CODE_MAX_COUNT} links.
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
          {codeError && <p className="text-xs text-destructive">{codeError}</p>}
          <div className="text-xs text-muted-foreground">
            Your link will be:{' '}
            <span className="font-mono text-foreground">
              https://x-meta.com/ref/{code || 'CODE'}
            </span>
          </div>
          <Alert variant="destructive" className="border-destructive/40">
            <AlertCircle className="size-4" />
            <AlertTitle>Double-check your code before saving</AlertTitle>
            <AlertDescription className="text-xs">
              Once created, this referral link{' '}
              <strong>cannot be edited or deleted</strong>. The code you choose
              is permanent and will keep tracking referrals as long as it&apos;s
              shared.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={!code || !!codeError || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating…' : 'Create Link'}
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
          isLoading={linksQuery.isLoading}
        />
        <StatCard
          label="Total Clicks"
          value={formatCount(totalClicks)}
          icon={MousePointerClick}
          isLoading={linksQuery.isLoading}
        />
        <StatCard
          label="Total Registrations"
          value={formatCount(totalReg)}
          icon={UserPlus}
          isLoading={linksQuery.isLoading}
        />
      </div>

      <BaseTable
        data={links}
        columns={linksColumns}
        rowKey="id"
        isLoading={linksQuery.isLoading}
        header={
          <DataTableHeader
            title="Referral Links"
            description={`Links are permanent — create up to ${REFERRAL_CODE_MAX_COUNT} unique codes`}
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

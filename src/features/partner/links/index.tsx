import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Link2, Plus, UserPlus } from 'lucide-react';
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
import { useI18n } from '#/i18n/context';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import {
  REFERRAL_CODE_MAX_COUNT,
  REFERRAL_CODE_MAX_LENGTH,
  createReferralLink,
  listReferralLinks,
  validateReferralCode,
} from '#/services/apis/partner/links';
import { formatCount } from '#/utils';
import { getLinksColumns } from './columns';

export function PartnerLinksPage() {
  const { t } = useI18n();
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
          <Plus className="size-4" /> {t('partner:links.createButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('partner:links.create.title')}</DialogTitle>
          <DialogDescription>
            {t('partner:links.create.description', undefined, {
              max: String(REFERRAL_CODE_MAX_COUNT),
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <label className="text-sm font-medium">
            {t('partner:links.create.label')}
          </label>
          <Input
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder={t('partner:links.create.placeholder')}
            maxLength={REFERRAL_CODE_MAX_LENGTH}
          />
          {codeError && <p className="text-xs text-destructive">{codeError}</p>}
          <div className="text-xs text-muted-foreground">
            {t('partner:links.create.preview')}{' '}
            <span className="font-mono text-foreground">
              https://x-meta.com/ref/{code || 'CODE'}
            </span>
          </div>
          <Alert variant="destructive" className="border-destructive/40">
            <AlertCircle className="size-4" />
            <AlertTitle>{t('partner:links.create.warning.title')}</AlertTitle>
            <AlertDescription className="text-xs">
              {t('partner:links.create.warning.description')}
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('partner:links.create.cancel')}
          </Button>
          <Button
            onClick={submit}
            disabled={!code || !!codeError || createMutation.isPending}
          >
            {createMutation.isPending
              ? t('partner:links.create.submitting')
              : t('partner:links.create.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Button disabled>
      <Plus className="size-4" />{' '}
      {t('partner:links.maxLinks', undefined, {
        max: String(REFERRAL_CODE_MAX_COUNT),
      })}
    </Button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('partner:links.title')}
        description={t('partner:links.description')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label={t('partner:links.totalLinks')}
          value={`${links.length} / ${REFERRAL_CODE_MAX_COUNT}`}
          icon={Link2}
          isLoading={linksQuery.isLoading}
        />
        <StatCard
          label={t('partner:links.totalRegistrations')}
          value={formatCount(totalReg)}
          icon={UserPlus}
          isLoading={linksQuery.isLoading}
        />
      </div>

      <BaseTable
        data={links}
        columns={getLinksColumns(t)}
        rowKey="id"
        isLoading={linksQuery.isLoading}
        header={
          <DataTableHeader
            title={t('partner:links.subtitle')}
            description={t('partner:links.permanent')}
            action={createButton}
          />
        }
        toolbar={{
          searchKey: 'code',
          searchPlaceholder: t('partner:links.search'),
        }}
      />
    </div>
  );
}

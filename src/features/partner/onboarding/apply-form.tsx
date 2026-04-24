import { useMutation } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '#/components/ui/button';
import { Card } from '#/components/ui/card';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { Textarea } from '#/components/ui/textarea';
import { useLocalizedNavigate } from '#/hooks/use-localized-navigate';
import { applyForPartner } from '#/services/apis/partner/profile';
import { loadUserProfile } from '#/stores/auth-actions';

interface Prefill {
  companyName?: string;
  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  audienceSize?: string;
  promotionPlan?: string;
}

export function ApplyPartnerForm({ prefill }: { prefill?: Prefill }) {
  const navigate = useLocalizedNavigate();
  const [companyName, setCompanyName] = useState(prefill?.companyName ?? '');
  const [website, setWebsite] = useState(prefill?.website ?? '');
  const [facebookUrl, setFacebookUrl] = useState(prefill?.facebookUrl ?? '');
  const [instagramUrl, setInstagramUrl] = useState(prefill?.instagramUrl ?? '');
  const [audienceSize, setAudienceSize] = useState(prefill?.audienceSize ?? '');
  const [promotionPlan, setPromotionPlan] = useState(prefill?.promotionPlan ?? '');

  const mutation = useMutation({
    mutationFn: applyForPartner,
    onSuccess: async () => {
      toast.success('Application submitted — our team will review it shortly');
      await loadUserProfile();
      // PartnerGate on /dashboard/overview will now show PendingApplication.
      await navigate('/dashboard/overview');
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to submit');
    },
  });

  const submit = () => {
    mutation.mutate({
      companyName,
      website,
      socialMedia: {
        facebook: facebookUrl,
        instagram: instagramUrl,
      },
      audienceSize,
      promotionPlan,
    });
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Become a Partner</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us about your channel — our team reviews every application
            within 2-3 business days.
          </p>
        </div>

        <Card className="gap-5 p-6">
          <Field label="Company / Brand Name" hint="Optional — leave blank if individual">
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Demo Trading LLC"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Facebook URL">
              <Input
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
            </Field>
            <Field label="Instagram URL">
              <Input
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/yourhandle"
              />
            </Field>
          </div>

          <Field label="Website" hint="Optional">
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://…"
            />
          </Field>

          <Field label="Audience Size">
            <Input
              value={audienceSize}
              onChange={(e) => setAudienceSize(e.target.value)}
              placeholder="e.g., 10k Instagram followers"
            />
          </Field>

          <Field
            label="Promotion Plan"
            hint="How will you promote xmeta to your audience?"
          >
            <Textarea
              value={promotionPlan}
              onChange={(e) => setPromotionPlan(e.target.value)}
              rows={5}
              placeholder="Briefly describe your channel, audience, and promotion strategy…"
            />
          </Field>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/overview')}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={mutation.isPending}>
            <Send className="size-4" />
            {mutation.isPending ? 'Submitting…' : 'Submit Application'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

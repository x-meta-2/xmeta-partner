import { z } from 'zod';

/**
 * Type-safe environment variables with runtime validation.
 *
 * For partner-web we only really need Cognito + partner API base, but several
 * inherited services (security, account) still read legacy VITE_NEW_XMETA_*
 * vars. We keep them optional and default them to VITE_PARTNER_API_URL so
 * imports keep compiling; consumers will be migrated in Phase 3.
 */

const partnerBase = (import.meta.env as Record<string, string | undefined>)
  .VITE_PARTNER_API_URL ?? 'http://localhost:8080';

const envSchema = z.object({
  // Cognito (partner user pool)
  VITE_COGNITO_USER_POOL_ID: z.string().min(1, 'Cognito user pool ID required'),
  VITE_COGNITO_CLIENT_ID: z.string().min(1, 'Cognito client ID required'),
  VITE_AWS_REGION: z.string().default('ap-southeast-1'),

  // Partner API
  VITE_API_BASE_URL: z.string().url().default('http://127.0.0.1:3002'),
  VITE_PARTNER_API_URL: z.string().url(),

  // Legacy (temporary — point at partner base until services are migrated)
  VITE_NEW_XMETA_API_URL: z.string().url().default(partnerBase),
  VITE_NEW_XMETA_ACCOUNT_API_URL: z.string().url().default(partnerBase),
  VITE_NEW_XMETA_STAKING_API_URL: z.string().url().default(partnerBase),
  VITE_NEW_XMETA_CONFIG_API_URL: z.string().url().default(partnerBase),
  VITE_NEW_XMETA_TAKE_ACTION_API_URL: z.string().url().default(partnerBase),
  VITE_NEW_XMETA_SECURITY_API_URL: z.string().url().default(partnerBase),
  VITE_API_SECURITY_URL: z.string().url().default(partnerBase),
  VITE_API_XMETA_URL: z.string().url().default(partnerBase),

  VITE_API_KEY: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors,
  );
  throw new Error(
    'Invalid environment variables. Check .env against .env.example',
  );
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;

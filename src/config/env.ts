import { z } from 'zod';

/**
 * Type-safe environment variables — partner-web needs only Cognito + Partner API.
 */
const envSchema = z.object({
  VITE_COGNITO_USER_POOL_ID: z.string().min(1, 'Cognito user pool ID required'),
  VITE_COGNITO_CLIENT_ID: z.string().min(1, 'Cognito client ID required'),
  VITE_AWS_REGION: z.string().default('ap-southeast-1'),
  VITE_PARTNER_API_URL: z.string().url(),
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

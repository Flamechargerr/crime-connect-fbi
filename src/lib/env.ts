import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL must be a valid URL'),
  VITE_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, 'VITE_SUPABASE_PUBLISHABLE_KEY is required'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).optional(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error(
    `Environment validation failed: ${parsed.error.issues
      .map((issue) => issue.message)
      .join(', ')}`
  );
}

export const appEnv = {
  supabaseUrl: parsed.data.VITE_SUPABASE_URL,
  supabasePublishableKey: parsed.data.VITE_SUPABASE_PUBLISHABLE_KEY,
  runtimeEnv: parsed.data.VITE_APP_ENV ?? 'development',
} as const;


-- Migration: Add promotion_redemptions table for starter coupon tracking.
-- Run this using the Supabase migration CLI or psql against the target database.

-- Make sure the pgcrypto extension is available for gen_random_uuid().
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.promotion_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id text NOT NULL REFERENCES public.apps(app_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  promo_key text NOT NULL,
  redeemed_at timestamptz NOT NULL DEFAULT now(),
  stripe_customer_id text NULL,
  stripe_subscription_id text NULL,
  stripe_invoice_id text NULL,
  stripe_event_id text NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS promotion_redemptions_unique
  ON public.promotion_redemptions (app_id, user_id, promo_key);

CREATE INDEX IF NOT EXISTS promotion_redemptions_app_user_redeemed_desc
  ON public.promotion_redemptions (app_id, user_id, redeemed_at DESC);

ALTER TABLE public.promotion_redemptions ENABLE ROW LEVEL SECURITY;

-- No RLS policies are added here; access is expected to go through the
-- server-side service role (supabaseAdmin) only.

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1W9ais2FuyeXL_6xDKdImjGlqjhznB96H

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
# misepo

## Starter promotion tracking

- Run `docs/migration_promotion_redemptions.sql` (or equivalent Supabase migration) before enabling checkout to create the `promotion_redemptions` table that tracks the first-time monthly coupon.
- First monthly checkout (plan=monthly) should still receive the 980円 price and create one row in `promotion_redemptions`. Replay the checkout and the webhook successfully records the redemption.
- Subsequent monthly checkouts for the same user/app must hit the 1980円 price, and the `promotion_redemptions` table stays at a single row. Annual checkouts never insert a redemption.

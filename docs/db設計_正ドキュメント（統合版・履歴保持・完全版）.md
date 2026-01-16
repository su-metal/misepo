# DB設計 正ドキュメント（統合版・履歴保持・完全版）

> 本ドキュメントは、**設計思想＋実装履歴を保持したまま**、
> Supabase + Next.js + Stripe を前提にした AIアプリ量産用DB設計の
> **唯一の正（Canonical）ドキュメント**である。
>
> 途中で整理・統合は行わない。
> 「なぜこの設計が必要になったか」が後から必ず追えることを最優先とする。

---

## 0. 目的

- AIアプリを高速に検証・量産・改善する
- 課金・無料・制限・例外を**事故らせない**
- 当たったアプリだけを **app_id 単位で切り出せる**
- Stripe / Supabase / Next.js 前提で **実装に耐える設計** にする

---

## 1. 最重要原則（不変）

- Supabase は **1プロジェクト / 1DB**
- すべてのテーブルは **app_id を必須で持つ**
- ユーザー種別は固定属性にしない（状態から派生）
- 判定は必ず **サーバ権威**
- クライアントは UI 表示のみ

---

## 2. アプリ識別（app_id）

- app_id はアプリ固有の公開ID
- 一度公開したら変更不可

例:
- misepo
- ai-review-helper
- sns-copy-writer

---

## 3. ユーザー種別（派生概念）

### 3.1 ゲスト（匿名）

- user_id なし
- device_id のみ
- 無料体験枠のみ
- 端末変更でリセット

### 3.2 無料登録ユーザー（Free）

- Supabase Auth で user_id を持つ
- entitlements に pro/active が存在しない
- 無料枠（quota）の制限対象

### 3.3 Proユーザー

- entitlements が **plan=pro & status=active**
- 課金主体
- 複数端末利用可

---

## 4. Plan / Feature / Quota 分離思想

| 概念 | 役割 | 説明 |
|----|----|----|
| Plan | 支払い状態 | free / pro |
| Feature | 機能解放 | 使えるか |
| Quota | 利用量 | 回数・チケット |

> **Pro = 無制限 にはしない**

---

## 5. Entitlements（Pro権利の唯一の真実）

```text
entitlements
- id
- app_id
- user_id
- plan                 // free / pro
- status               // active / expired / canceled / past_due
- started_at
- expires_at
- billing_provider     // stripe / revenuecat / null
- billing_reference_id // subscription_id
- created_at
```

### 制約

- unique(app_id, user_id)
- 同一ユーザー × 同一アプリで常に1行

### Pro判定ルール

- plan = pro
- status = active
- expires_at が未来 or null

---

## 6. Feature 解放設計

```text
feature_definitions
- feature_key
- description

plan_features
- app_id
- plan
- feature_key
- enabled

feature_overrides
- app_id
- user_id (nullable)
- feature_key
- enabled
```

### 優先順位

1. user_id override
2. app_id override
3. plan_features
4. default false

---

## 7. Quota（利用制限）

### 7.1 Rate Quota（無料回数制限）

```text
quota_rate_policies
- app_id
- feature_key
- plan
- period_type
- limit_count

quota_rate_usage
- app_id
- feature_key
- period_start
- used_count
- user_id (nullable)
- device_id (nullable)
```

---

### 7.2 Balance Quota（チケット制）

```text
quota_balance_accounts
- app_id
- user_id
- feature_key
- balance
- expires_at

quota_balance_ledger
- id
- app_id
- user_id
- feature_key
- delta
- reason
- created_at
```

---

## 8. アプリ固有プロフィール

```text
app_user_profiles
- app_id
- user_id
- profile_key
- profile_data (jsonb)
- created_at
- updated_at
```

---

## 9. AI実行・ログ

```text
ai_runs
- id
- app_id
- user_id
- feature_key
- model
- status
- tokens_in
- tokens_out
- cost_estimate
- created_at

usage_events
- id
- app_id
- user_id
- device_id
- feature_key
- run_id
- consumed_type
- consumed_amount
- created_at
```

---

## 10. ゲスト → 登録 移行

```text
device_links
- app_id
- device_id
- user_id
- linked_at
```

---

## 11. セッション管理（Proのみ）

- 最大3端末
- 超過時は LRU 失効

---

## 12. RLS 方針

- 全テーブル RLS 有効
- select: user_id + app_id
- write: 原則 server only

---

## 13. サーバ権威ルール

- Pro判定
- Quota消費
- Feature可否
- 課金状態

---

## 14. スケール戦略

- 通常: 1DB
- バズ時: app_id 単位で分離

---

## 15. 【実装反映】週次クレジット（MisePo確定事項）

### 実テーブル名

- ticket_balances（残高）
- ticket_ledger（履歴）

> quota_balance_* の思想を維持した **実装名**

### RPC

- consume_weekly_credits(...)
- OUT: ok, out_balance

---

## 16. 【実装反映】Stripe Customer 管理

### entitlements 追記カラム

```text
- stripe_customer_id // cus_...
```

### 理由

- Checkout / Webhook / Customer Portal を安定して繋ぐため
- customer を都度作らない

---

## 17. 【追加設計】汎用プロモーション利用履歴（初回割引制御）

### 背景

- 初月980円などの割引を
- **同一ユーザーが何度も使えない**ようにする必要がある

### テーブル

```text
promotion_redemptions
- id
- app_id
- user_id
- promo_key
- redeemed_at
- stripe_customer_id
- stripe_subscription_id
- stripe_invoice_id
- stripe_event_id
- metadata (jsonb)
```

### 制約（最重要）

- unique(app_id, user_id, promo_key)

### 運用

- Checkout前に参照（割引適用可否）
- Webhookで確定（on conflict do nothing）

---

## 18. 原則まとめ（1行）

> **1DB / app_id分離 / Plan・Feature・Quota分離 / 履歴を残すサーバ権威設計**


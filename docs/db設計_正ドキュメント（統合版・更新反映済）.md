# DB設計 正ドキュメント（統合最新版・更新反映済）

本ドキュメントは、**AGENTS.md に定義された思想を一切削らず**、そこに

- plan / feature / quota 分離設計
- Pro≠無制限 を前提としたコスト安全設計
- **実DB運用で確定した改善点（entitlements更新）**

を**上書きではなく統合**した「正（Canonical）」なDB設計ドキュメントである。

Next.js + Supabase を前提に、**AI系PWAアプリを量産・検証・スケール**させるための共通テンプレとして使用する。

---

## 0. 目的（AGENTS.md 準拠）

- 1つの Supabase プロジェクト（1DB）で全アプリを管理
- 匿名利用 → 無料枠
- 無料登録 → 無料枠（認証済）
- Proサブスク → 権利管理
- 高コスト機能 → 月次チケット制
- 当たったアプリのみ app_id 単位で切り出し可能

---

## 1. 全体方針（最重要・不変）

- Supabase は **1プロジェクト / 1DB**
- 全テーブルは **app_id を必須キー**として持つ
- 重要判定はすべて **サーバ権威**
- クライアントは UI 表示のみ
- 推測・ログベース判定は禁止

---

## 2. アプリ識別（app_id）

- すべてのデータは `app_id` を必ず持つ
- `app_id` は公開後変更不可

例:

- `math-coach`
- `ai-note-helper`

---

## 3. 認証とユーザー種別

本設計では、ユーザー種別を固定属性として保持せず、**状態から派生判定**する。

### 3.1 匿名ユーザー（ゲスト）

- user_id を持たない
- device_id のみで識別
- ログイン不要
- 無料枠（rate quota）の制限対象
- 端末変更・再インストール救済なし

### 3.2 無料登録ユーザー（認証済・非Pro）

- Supabase Auth により user_id を持つ
- entitlements に active な Pro 権利を持たない
- app_id に紐づくアプリ固有プロフィールが存在する
- 無料枠（rate quota）の制限対象

### 3.3 Proユーザー（認証＋課金）

- Supabase Auth 必須
- entitlements が **plan=pro かつ status=active**
- 課金・権利の主体
- 複数端末利用可

---

## 4. Plan / Feature / Quota 分離思想

### 4.1 概念分離

| 概念 | 役割 | 備考 |
|---|---|---|
| Plan | 支払い・契約状態 | Free / Pro |
| Feature | 機能解放 | 使えるかどうか |
| Quota | 利用量制限 | 回数・チケット |

※ **Pro = 無制限 とは一切しない**

---

## 5. Pro権利（Entitlements）【更新反映】

### entitlements（唯一の真実）

```text
entitlements
- id
- app_id
- user_id
- plan            // free / pro
- status          // active / expired / canceled / past_due
- started_at
- expires_at
- billing_provider      // 'stripe' | 'revenuecat' | null
- billing_reference_id  // subscription_id 等
- created_at
```

### 制約・運用ルール

- **unique(app_id, user_id)** を必須
- 同一ユーザー × 同一アプリで entitlements は常に1行
- status により「支払い状態」を厳密に表現

### 判定ルール

- plan = `pro`
- status = `active`
- かつ expires_at が未来 または null

---

## 6. Feature（機能解放）

### 6.1 feature_definitions

```text
feature_definitions
- feature_key
- description
```

### 6.2 plan_features（プラン既定）

```text
plan_features
- app_id
- plan
- feature_key
- enabled
```

### 6.3 feature_overrides（例外対応）

```text
feature_overrides
- app_id
- user_id (nullable)
- feature_key
- enabled
```

### 優先順位

1. user_id 指定 override
2. app_id override
3. plan_features
4. default false

---

## 7. Quota（利用制限）設計

Quota は **2種類に分離**する。

### 7.1 無料枠（rate quota）

```text
quota_rate_policies
- app_id
- feature_key
- plan (guest / free)
- period_type     // day / month
- limit_count
```

```text
quota_rate_usage
- app_id
- feature_key
- period_start
- used_count
- user_id    // nullable
- device_id  // nullable
```

※ user_id / device_id は **どちらか一方のみ必須**（CHECK制約）

---

### 7.2 チケット制（balance quota）

```text
quota_balance_accounts
- app_id
- user_id
- feature_key
- balance
- expires_at
```

```text
quota_balance_ledger
- id
- app_id
- user_id
- feature_key
- delta
- reason          // grant / consume
- related_run_id
- created_at
```

---

## 8. アプリ固有プロフィール

```text
app_user_profiles
- app_id
- user_id
- profile_key
- profile_data    // json / jsonb
- created_at
- updated_at
```

---

## 9. AI実行・ログ

### 9.1 ai_runs

```text
ai_runs
- id
- app_id
- user_id
- feature_key
- model
- status          // success / error / timeout
- tokens_in
- tokens_out
- cost_estimate
- prompt_version
- created_at
```

### 9.2 usage_events

```text
usage_events
- id
- app_id
- user_id
- device_id
- feature_key
- run_id
- consumed_type   // rate / balance
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

## 11. 端末セッション（Proのみ）

- 複数端末利用可
- 想定上限: 3台（ソフト制限）
- 4台目ログイン時:
  - 表示なし
  - LRU 端末を自動失効

---

## 12. RLS（Row Level Security）【方針明確化】

- すべてのテーブルで RLS 有効化
- select:
  - app_id 一致
  - user_id 一致
- insert / update / delete:
  - 原則 **サーバ（service role）専用**
- 課金・Pro判定ロジックは RLS に含めない

---

## 13. サーバ権威ルール

Next.js Route Handler で必ず判定:

- ユーザー種別（guest / free / pro）
- Proかどうか
- Feature利用可否
- 無料枠残り
- チケット付与・消費
- AI実行可否

---

## 14. スケールと分離

- 通常: 1DBで全運用
- バズ・負荷時:
  - 特定 app_id を別DBへ移行
  - app_id 境界で安全に分離可能

---

## 15. 適用範囲

適する:

- AIユーティリティ
- 学習支援
- 診断・分析

適さない:

- SNS
- 掲示板
- 複雑な多対多リレーション

---

## 16. 原則まとめ（1行）

> **1DB・app_id分離・Plan/Feature/Quota分離・サーバ権威で失敗しにくい量産設計**


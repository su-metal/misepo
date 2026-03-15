# MisePo — AI SNS投稿生成SaaS

> 飲食・美容・小売などの店舗向けに、AIがSNS投稿文を自動生成するWebサービス

**本番URL:** https://www.misepo.jp

---

## 開発の背景

製造・販売の現場で27年間働く中で感じた課題：
**「情報発信したいけど、毎日SNS投稿を考える時間がない」**

業種・ターゲット・トーンを入力するだけで、AIが最適な投稿文を自動生成するSaaSを個人で0→1で構築。
Claude Codeを活用したバイブコーディングで実装。

---

## 主な機能

- **AI投稿生成** — Google Gemini APIによる自然な文章生成
- **11業種対応** — レストラン・カフェ・美容サロン・ホテル等
- **5プラットフォーム対応** — X・Instagram・LINE・Googleマップ・汎用
- **サブスクリプション** — Stripe決済（980円/月〜）
- **学習機能** — ユーザーの好みを学習し精度向上
- **生成履歴** — 過去の投稿文を管理・再利用

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フロントエンド | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| AI | Google Gemini API |
| バックエンド | Next.js API Routes |
| DB・認証 | Supabase |
| 決済 | Stripe |
| アニメーション | Framer Motion |
| テスト | Playwright (E2E) |
| ホスティング | Vercel |

---

## ローカル起動

```bash
git clone https://github.com/su-metal/misepo
cd misepo
npm install

# .env.local を作成して環境変数を設定
cp .env.example .env.local

npm run dev
```

---

## 開発について

**このプロジェクトはバイブコーディングで構築しています。**
Claude Code等のAIエージェントと協働し、設計・要件定義・動作検証を担当。
AIを正しく使って実用サービスを作ることを実証するプロジェクトです。

- コミット数: 1,000+
- 開発期間: 継続中
- 運用状況: 本番稼働中

---

## 作者

**佐田 真教 (Masanori Sada)**
製造業での現場経験を活かし、業務効率化・AI活用を探求中。

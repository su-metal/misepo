-- 【全環境・または特定環境リセット用SQL】
-- 本番環境（misepo）のデータも消す場合は、target_app_id を 'misepo' に変更して実行してください。

DO $$ 
DECLARE 
    -- ここを 'misepo' に書き換えると本番ラベルのデータが消えます。
    -- もし「全てのAPP_ID」を一括で消したい場合は、WHERE条件から app_id = ... を抜いたSQLにする必要があります。
    target_app_id TEXT := 'misepo'; 
BEGIN
    RAISE NOTICE 'Resetting all data for APP_ID: %', target_app_id;

    -- 1. 学習データ（依存関係のため最初）
    DELETE FROM public.learning_sources 
    WHERE preset_id IN (SELECT id::text FROM public.user_presets WHERE app_id = target_app_id);

    -- 2. ユーザープリセット
    DELETE FROM public.user_presets WHERE app_id = target_app_id;

    -- 3. AI実行詳細
    DELETE FROM public.ai_run_records WHERE app_id = target_app_id;

    -- 4. AI実行履歴
    DELETE FROM public.ai_runs WHERE app_id = target_app_id;

    -- 5. アプリ用ユーザープロファイル
    DELETE FROM public.app_user_profiles WHERE app_id = target_app_id;

    -- 6. 特典・契約情報
    DELETE FROM public.entitlements WHERE app_id = target_app_id;

    -- 7. プロモーション・クーポン利用履歴
    DELETE FROM public.promotion_redemptions WHERE app_id = target_app_id;

    -- 8. アプリ定義本体（最後に削除）
    DELETE FROM public.apps WHERE app_id = target_app_id;

    RAISE NOTICE 'Reset complete for APP_ID: %', target_app_id;
END $$;

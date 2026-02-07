import { supabaseAdmin } from "@/lib/supabase/admin";
import { getJSTDateRange } from "@/lib/dateUtils";

/**
 * ユーザーのAI使用回数（重み付き）を計算する共通ユーティリティ
 * 
 * @param userId Auth User UUID
 * @param appId App ID
 * @param periodType 'daily' (24h) or 'monthly' (Stripe cycle or calendar month)
 * @param monthStartTime (Optional) 有料プランの場合のStripe契約期間開始日
 * @returns usage (number) 重み付き合計回数
 */
export async function getUserUsage(
  userId: string,
  appId: string,
  periodType: 'daily' | 'monthly' = 'daily',
  sinceTime?: string | null
): Promise<number> {
  const { startOfToday, startOfMonth } = getJSTDateRange();
  
  // 1. 基本となる開始日（今日0時 or 今月1日0時）
  let effectiveStart = (periodType === 'monthly') ? startOfMonth : startOfToday;

  // 2. sinceTime（Stripe契約日やトライアル開始日）が指定されている場合、
  // 基本開始日よりも新しい方（未来）を採用する。
  // これにより、同一日のリセットやプラン変更前のカウントが混入するのを防ぐ。
  if (sinceTime) {
    const sDate = new Date(sinceTime);
    const bDate = new Date(effectiveStart);
    if (sDate > bDate) {
      effectiveStart = sinceTime;
    }
  }

  const { data, error } = await supabaseAdmin
    .from("ai_runs")
    .select("run_type, created_at")
    .eq("user_id", userId)
    .eq("app_id", appId)
    .in("run_type", ["generation", "multi-gen", "refine"])
    .gte("created_at", effectiveStart);

  if (error) {
    console.error(`[UsageCalc] Error for user ${userId}:`, error);
    return 0;
  }

  if (!data) return 0;

  // 重み付け計算: multi-gen は 2, その他は 1
  return data.reduce((acc, curr) => acc + (curr.run_type === 'multi-gen' ? 2 : 1), 0);
}

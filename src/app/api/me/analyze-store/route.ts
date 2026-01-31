import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";

// geminiService.ts と同じ初期化方法に合わせる
const getServerAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing API_KEY in server env");
  return new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { placeData } = await req.json();

    if (!placeData) {
      return NextResponse.json({ ok: false, error: "Missing place data" }, { status: 400 });
    }

    const ai = getServerAI();

    const prompt = `
以下のGoogleマップ店舗情報（概要、属性、口コミ）を元に、SNS運用を最適化するための店舗分析を行ってください。

【出力形式】
必ず以下のJSON形式で出力してください。Markdownのコードブロックは不要です。
{
  "aiAnalysis": "店舗の背景知識（200-400文字）。AIが投稿案を作成する際の裏側の指針。店の雰囲気、強み、ターゲット客層等を深く掘り下げてください。",
  "description": "ユーザー向けの店舗紹介文（100-150文字程度）。オンボーディングの『施設の特徴・こだわり』欄に初期値として設定する内容です。魅力的で親しみやすく、その店の個性が一目でわかる文章にしてください。"
}

【店舗情報】
名前: ${placeData.name}
概要: ${placeData.editorial_summary || "なし"}
属性: ${placeData.types?.join(", ") || "なし"}
口コミ抜粋:
${placeData.reviews?.map((r: any) => `- ${r.text}`).join("\n") || "なし"}
`;

    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash-lite",
      // @ts-ignore
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        // @ts-ignore
        responseMimeType: "application/json",
        temperature: 0.3,
        topP: 0.9,
      }
    });

    const result = await response;
    // @ts-ignore
    const jsonText = result.text || "";
    
    if (!jsonText) {
      throw new Error("No text returned from Gemini");
    }

    const parsed = JSON.parse(jsonText);

    return NextResponse.json({
      ok: true,
      aiAnalysis: (parsed.aiAnalysis || "").trim(),
      description: (parsed.description || "").trim(),
    });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || "AI analysis failed" 
    }, { status: 500 });
  }
}

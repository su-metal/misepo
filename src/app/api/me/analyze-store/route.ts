import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";
import { INDUSTRY_TOPIC_POOL } from "@/constants/industryTopics";

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
    const { placeData, industry: selectedIndustry } = await req.json();

    if (!placeData) {
      return NextResponse.json({ ok: false, error: "Missing place data" }, { status: 400 });
    }

    const ai = getServerAI();
    
    // Get base templates for the industry
    const industry = selectedIndustry || "飲食店";
    const basePool = INDUSTRY_TOPIC_POOL[industry] || INDUSTRY_TOPIC_POOL["その他"];
    
    // Pick 8 random topics to tailor
    const sampledTopics = [...basePool].sort(() => Math.random() - 0.5).slice(0, 8);

    const prompt = `
以下のGoogleマップ店舗情報を元に、店舗分析とSNS投稿トピックの最適化を行ってください。

【店舗情報】
名前: ${placeData.name}
カテゴリー: ${industry}
概要: ${placeData.editorial_summary || "なし"}
属性: ${placeData.types?.join(", ") || "なし"}
口コミ抜粋:
${placeData.reviews?.map((r: any) => `- ${r.text}`).join("\n") || "なし"}

【タスク】
1. 店舗の背景知識 (aiAnalysis) と紹介文 (description) を作成してください。
2. 以下の基礎トピックを、この店舗の具体的な特徴に合わせてリライトしてください（例：パン屋なら「看板メニュー」を「自慢の焼きたてパン」に変更）。
   リライト対象トピック:
   ${JSON.stringify(sampledTopics, null, 2)}

必ず以下のJSON形式のみで出力してください。
{
  "aiAnalysis": "店舗の背景知識（200-400文字）。AIが投稿案を作成する際の指針。",
  "description": "ユーザー向けの店舗紹介文（100-150文字程度）。",
  "tailoredTopics": [
    {
      "title": "リライト後のタイトル",
      "description": "リライト後の説明",
      "prompt": "リライト後のAIへの指示文",
      "question": "リライト後の店主への質問文",
      "icon": "元のアイコン"
    }
  ]
}
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
      tailoredTopics: parsed.tailoredTopics || [],
      industry: industry,
    });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || "AI analysis failed" 
    }, { status: 500 });
  }
}

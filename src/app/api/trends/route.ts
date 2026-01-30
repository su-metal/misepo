
import { NextRequest, NextResponse } from 'next/server';
import { generateTrendCalendar } from '@/services/geminiService';

export const maxDuration = 60; // Allow longer timeout for AI generation

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || '2026');
    const month = parseInt(searchParams.get('month') || '2'); // 1-12
    const duration = parseInt(searchParams.get('duration') || '3');

    if (isNaN(year) || isNaN(month) || isNaN(duration)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    console.log(`[API/Trends] Fetching trends for ${year}-${month} duration:${duration}`);

    const trends = await generateTrendCalendar(year, month, duration);

    return NextResponse.json({ trends });
    
  } catch (error: any) {
    console.error("[API/Trends] Error:", error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch trends' }, 
      { status: 500 }
    );
  }
}

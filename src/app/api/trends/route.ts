
import { NextRequest, NextResponse } from 'next/server';
import { generateTrendCalendar } from '@/services/geminiService';

export const maxDuration = 60; // Allow longer timeout for AI generation

// Helper to handle both GET and POST logic
async function handleTrendsRequest(params: {
  year: number;
  month: number;
  duration: number;
  force: boolean;
  industry?: string;
  description?: string;
}) {
  const { year, month, duration, force, industry, description } = params;
  
  // 1. Check Global Cache First (Hit/Miss)
  let cachedTrends: any[] = [];
  let missingMonth = false;
  
  // Dynamic import to avoid build issues on client-side
  const { getCachedTrends, saveTrendsToCache } = await import('@/lib/trendCache');
  
  if (!force) {
    for (let i = 0; i < duration; i++) {
      let currentYear = year;
      let currentMonth = month + i;
      if (currentMonth > 12) {
        currentMonth -= 12;
        currentYear += 1;
      }
      
      const monthData = await getCachedTrends(currentYear, currentMonth, industry, description);
      
      if (monthData) {
        cachedTrends = [...cachedTrends, ...monthData];
      } else {
        missingMonth = true;
        break;
      }
    }

    if (!missingMonth && cachedTrends.length > 0) {
      console.log(`[API/Trends] Cache HIT for ${year}-${month}`);
      return { trends: cachedTrends };
    }
  }

  console.log(`[API/Trends] Cache MISS. Generating fresh trends...`);
  const trends = await generateTrendCalendar(year, month, duration, industry, description);
  saveTrendsToCache(trends, industry, description).catch(err => console.error("Cache write error:", err));
  
  return { trends };
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || '2026');
    const month = parseInt(searchParams.get('month') || '2'); // 1-12
    const duration = parseInt(searchParams.get('duration') || '3');
    const force = searchParams.get('force') === 'true';
    const industry = searchParams.get('industry') || undefined;
    const description = searchParams.get('description') || undefined;

    if (isNaN(year) || isNaN(month) || isNaN(duration)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const result = await handleTrendsRequest({ year, month, duration, force, industry, description });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API/Trends] GET Error:", error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch trends', details: String(error) }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { year, month, duration, force, industry, description } = body;

    if (!year || !month) {
      return NextResponse.json({ error: 'Missing year or month' }, { status: 400 });
    }

    const result = await handleTrendsRequest({ 
      year: parseInt(String(year)), 
      month: parseInt(String(month)), 
      duration: parseInt(String(duration || 3)), 
      force: !!force, 
      industry, 
      description 
    });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API/Trends] POST Error:", error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch trends', details: String(error) }, 
      { status: 500 }
    );
  }
}

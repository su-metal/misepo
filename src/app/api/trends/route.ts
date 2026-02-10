
import { NextRequest, NextResponse } from 'next/server';
import { generateTrendCalendar, generateDailyContext } from '@/services/geminiService';
import { getCachedDailyContext, saveDailyContextToCache } from '@/lib/dailyContextCache';

export const maxDuration = 60; // Allow longer timeout for AI generation

// Helper to handle DailyContext (Weather, Events, etc.)
async function handleDailyContextRequest(date: string, region?: string, force: boolean = false) {
  if (!region) return null;
  
  // 1. Check Cache
  if (!force) {
    const cached = await getCachedDailyContext(date, region);
    if (cached) return cached;
  }
  
  // 2. Generate
  console.debug(`[API/Trends] Generating DailyContext for ${date} in ${region} (Force: ${force})`);
  const context = await generateDailyContext(date, region);
  
  // 3. Save Cache
  saveDailyContextToCache(context).catch(err => console.error("DailyContext Cache write error:", err));
  
  return context;
}

// Helper to handle both GET and POST logic for Trends
async function handleTrendsRequest(params: {
  year: number;
  month: number;
  duration: number;
  force: boolean;
  industry?: string;
  description?: string;
  region?: string;
  date?: string;
}) {
  const { year, month, duration, force, industry, description, region, date } = params;
  
  // 1. Get DailyContext if possible (always try to include in response for sommelier)
  const todayStr = date || new Date().toISOString().split('T')[0];
  const dailyContext = await handleDailyContextRequest(todayStr, region, force);

  // 2. Check Global Cache for Trends
  let cachedTrends: any[] = [];
  let missingMonth = false;
  
  const { getCachedTrends, saveTrendsToCache } = await import('@/lib/trendCache');
  
  if (!force) {
    for (let i = 0; i < duration; i++) {
      let currentYear = year;
      let currentMonth = month + i;
      if (currentMonth > 12) {
        currentMonth -= 12;
        currentYear += 1;
      }
      
      const monthData = await getCachedTrends(currentYear, currentMonth, industry);
      
      if (monthData) {
        cachedTrends = [...cachedTrends, ...monthData];
      } else {
        missingMonth = true;
        break;
      }
    }

    if (!missingMonth && cachedTrends.length > 0) {
      return { trends: cachedTrends, dailyContext };
    }
  }

  const trends = await generateTrendCalendar(year, month, duration, industry, description);
  saveTrendsToCache(trends, industry).catch(err => console.error("Cache write error:", err));
  
  return { trends, dailyContext };
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
    const region = searchParams.get('region') || undefined;
    const date = searchParams.get('date') || undefined;

    if (isNaN(year) || isNaN(month) || isNaN(duration)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const result = await handleTrendsRequest({ year, month, duration, force, industry, description, region, date });
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
    const { year, month, duration, force, industry, description, region, date } = body;

    if (!year || !month) {
      return NextResponse.json({ error: 'Missing year or month' }, { status: 400 });
    }

    const result = await handleTrendsRequest({ 
      year: parseInt(String(year)), 
      month: parseInt(String(month)), 
      duration: parseInt(String(duration || 3)), 
      force: !!force, 
      industry, 
      description,
      region,
      date
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

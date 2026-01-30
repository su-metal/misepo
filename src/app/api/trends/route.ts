
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

    // 1. Check Global Cache First (Hit/Miss)
    // We check the requested start month first. Ideally we should check all requested months,
    // but for simplicity, if the start month exists, we return what we have or try to construct the full range.
    // Since our AI generates 3 months at a time, we can assume if start month is there, others likely are or will be fetched.
    
    // Actually, let's try to gather cached data for the requested duration.
    let cachedTrends: any[] = [];
    let missingMonth = false;
    
    for (let i = 0; i < duration; i++) {
        let currentYear = year;
        let currentMonth = month + i;
        if (currentMonth > 12) {
            currentMonth -= 12;
            currentYear += 1;
        }
        
        // Dynamic import to avoid build issues on client-side if this shared code was used there (it's API route so it's safe)
        const { getCachedTrends } = await import('@/lib/trendCache');
        const monthData = await getCachedTrends(currentYear, currentMonth);
        
        if (monthData) {
            cachedTrends = [...cachedTrends, ...monthData];
        } else {
            missingMonth = true;
            break; // If any month in the range is missing, re-generate strictly to ensure consistency or simpler logic
        }
    }

    if (!missingMonth && cachedTrends.length > 0) {
        console.log(`[API/Trends] Cache HIT for ${year}-${month}`);
        return NextResponse.json({ trends: cachedTrends });
    }

    console.log(`[API/Trends] Cache MISS. Generating fresh trends...`);
    const trends = await generateTrendCalendar(year, month, duration);
    
    // 2. Save to Global Cache
    const { saveTrendsToCache } = await import('@/lib/trendCache');
    await saveTrendsToCache(trends);

    return NextResponse.json({ trends });
    
  } catch (error: any) {
    console.error("[API/Trends] Error:", error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch trends' }, 
      { status: 500 }
    );
  }
}

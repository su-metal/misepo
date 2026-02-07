
import fs from 'fs';
import path from 'path';
import { DailyContext } from '@/types';

const CACHE_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'dailyContext.json');

interface DailyContextCache {
  // Key: "YYYY-MM-DD:Region"
  [key: string]: {
    data: DailyContext;
    timestamp: number;
  };
}

function readCache(): DailyContextCache {
  try {
    if (!fs.existsSync(CACHE_FILE_PATH)) {
      return {};
    }
    const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading daily context cache:", error);
    return {};
  }
}

function writeCache(cache: DailyContextCache) {
  try {
    const dir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing daily context cache:", error);
  }
}

export async function getCachedDailyContext(date: string, region: string): Promise<DailyContext | null> {
  const key = `${date}:${region}`;
  const cache = readCache();
  
  const entry = cache[key];
  if (entry) {
    // Cache for 24 hours (86400000 ms)
    const isExpired = Date.now() - entry.timestamp > 86400000;
    if (!isExpired) {
      return entry.data;
    }
  }
  
  return null;
}

export async function saveDailyContextToCache(context: DailyContext) {
  const cache = readCache();
  const key = `${context.date}:${context.region}`;
  
  cache[key] = {
    data: context,
    timestamp: Date.now()
  };
  
  writeCache(cache);
}

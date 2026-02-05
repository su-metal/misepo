
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { TrendEvent } from '@/types';

const CACHE_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'trends.json');

interface TrendCache {
  // Key: "YYYY-MM"
  [key: string]: {
    data: TrendEvent[];
    timestamp: number;
  };
}

/**
 * Reads the global trend cache from the file system.
 */
function readCache(): TrendCache {
  try {
    if (!fs.existsSync(CACHE_FILE_PATH)) {
      return {};
    }
    const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading trend cache:", error);
    return {};
  }
}

/**
 * Writes the global trend cache to the file system.
 */
function writeCache(cache: TrendCache) {
  try {
    // Ensure directory exists
    const dir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing trend cache:", error);
  }
}

/**
 * Gets cached trends for a specific month if they exist.
 */
export async function getCachedTrends(year: number, month: number, industry?: string): Promise<TrendEvent[] | null> {
  const key = `${year}-${String(month).padStart(2, '0')}-${industry || 'default'}`;
  const cache = readCache();
  
  if (cache[key] && cache[key].data && cache[key].data.length > 0) {
    return cache[key].data;
  }
  
  return null;
}

/**
 * Saves generated trends to the global cache by month key.
 * This handles parsing the full list and bucketing them by month.
 */
export async function saveTrendsToCache(trends: TrendEvent[], industry?: string) {
  const cache = readCache();
  
  // Group trends by "YYYY-MM"
  const buckets: { [key: string]: TrendEvent[] } = {};
  
  trends.forEach(trend => {
    // Trend date format is "YYYY-MM-DD"
    const prefix = `${trend.date.substring(0, 7)}-${industry || 'default'}`; // "YYYY-MM-INDUSTRY"
    if (!buckets[prefix]) {
      buckets[prefix] = [];
    }
    buckets[prefix].push(trend);
  });
  
  // Update cache with new buckets
  const now = Date.now();
  Object.keys(buckets).forEach(key => {
    cache[key] = {
      data: buckets[key],
      timestamp: now
    };
  });
  
  writeCache(cache);
}

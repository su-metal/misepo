/**
 * dateUtils.ts
 * 
 * Provides robust date calculation for JST (Japan Standard Time, UTC+9).
 * This ensures consistency across environments (Vercel UTC, Local JST/EST, etc).
 */

const JST_OFFSET_HOURS = 9;
const JST_OFFSET_MS = JST_OFFSET_HOURS * 60 * 60 * 1000;

/**
 * Returns the ISO 8601 strings for "Start of Month" and "Start of Today" in JST.
 * The strings are converted back to UTC for database comparison.
 * 
 * Logic:
 * 1. Take current UTC time.
 * 2. Add 9 hours to get "JST Wall Time".
 * 3. Truncate to YYYY-MM-01 00:00:00 (Month) or YYYY-MM-DD 00:00:00 (Today).
 * 4. Subtract 9 hours to get the actual UTC timestamp for that JST Midnight.
 */
export function getJSTDateRange(now: Date = new Date()) {
  const utcTime = now.getTime();
  const jstTime = utcTime + JST_OFFSET_MS;
  
  // We act as if this timestamp is UTC to extract "Wall Clock" components easily
  const jstDate = new Date(jstTime);
  
  // Extract components using UTC methods on the shifted time
  // Example: 07:00 UTC -> 16:00 JST. 
  // jstDate (as UTC representation) is 16:00. getUTCHours() is 16.
  const jstYear = jstDate.getUTCFullYear();
  const jstMonth = jstDate.getUTCMonth();
  const jstDay = jstDate.getUTCDate();
  
  // Construct Start of Month (JST Wall Clock: YYYY-MM-01 00:00:00)
  // We use Date.UTC to get the timestamp of that wall clock time
  const startOfMonthJSTWall = Date.UTC(jstYear, jstMonth, 1, 0, 0, 0, 0);
  
  // Shift back to real UTC
  const startOfMonthUTC = new Date(startOfMonthJSTWall - JST_OFFSET_MS);

  // Construct Start of Today (JST Wall Clock: YYYY-MM-DD 00:00:00)
  const startOfTodayJSTWall = Date.UTC(jstYear, jstMonth, jstDay, 0, 0, 0, 0);
  
  // Shift back to real UTC
  const startOfTodayUTC = new Date(startOfTodayJSTWall - JST_OFFSET_MS);

  return {
    startOfMonth: startOfMonthUTC.toISOString(),
    startOfToday: startOfTodayUTC.toISOString(),
  };
}

/**
 * Returns current JST time as a Date object (approximate, for logging/debugging).
 * Note: This Date object technically represents "Now + 9h" in absolute terms.
 * Good for printing. Bad for timestamp math unless carefully tracked.
 */
export function getJSTDate(now: Date = new Date()) {
  return new Date(now.getTime() + JST_OFFSET_MS);
}

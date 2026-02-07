const tables = ['user_presets', 'learning_sources', 'entitlements', 'ai_runs', 'promotion_redemptions'];
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aW5pbXhpa2NpaGRxcWR2cHBhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzEwMTAxNiwiZXhwIjoyMDgyNjc3MDE2fQ.f3meiHxBIps8_md9p1NuKZr7N8WgheT-i3bLp47XBqI";

async function run() {
  for (const table of tables) {
    try {
      const res = await fetch(`https://wzinimxikcihdqqdvppa.supabase.co/rest/v1/${table}?select=*&limit=1`, {
        headers: { "apikey": KEY, "Authorization": `Bearer ${KEY}` }
      });
      const data = await res.json();
      console.log(`Table: ${table}`);
      if (data && data.length > 0) {
        console.log("Columns:", Object.keys(data[0]));
      } else {
        console.log("No data or error:", data);
      }
    } catch (e) {
      console.error(`Error checking ${table}:`, e);
    }
  }
}

run();

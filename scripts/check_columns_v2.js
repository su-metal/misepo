const tables = ['ai_run_records', 'feedbacks', 'app_user_profiles', 'device_sessions'];
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

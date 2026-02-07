const URL = "https://wzinimxikcihdqqdvppa.supabase.co/rest/v1/entitlements?select=*&limit=1";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aW5pbXhpa2NpaGRxcWR2cHBhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzEwMTAxNiwiZXhwIjoyMDgyNjc3MDE2fQ.f3meiHxBIps8_md9p1NuKZr7N8WgheT-i3bLp47XBqI";

async function run() {
  try {
    const res = await fetch(URL, {
      headers: {
        "apikey": KEY,
        "Authorization": `Bearer ${KEY}`
      }
    });
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error:", e);
  }
}

run();

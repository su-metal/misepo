
const year = 2026;
const month = 2;
const duration = 1;
const body = JSON.stringify({ year, month, duration });

async function test() {
  console.log("Testing POST /api/trends...");
  try {
    const res = await fetch("http://localhost:3000/api/trends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response keys:", Object.keys(data));
    if (data.trends) {
      console.log("Trends count:", data.trends.length);
    } else {
      console.log("Error:", data.error);
    }
  } catch (e) {
    console.log("Fetch failed (expected if dev server not running):", e.message);
  }
}

test();

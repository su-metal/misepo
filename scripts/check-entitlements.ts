import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Load .env from project root manually
function loadEnv(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");
  content.split("\n").forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
         process.env[key] = value;
      }
    }
  });
}

loadEnv(path.resolve(process.cwd(), ".env"));
loadEnv(path.resolve(process.cwd(), ".env.local"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("Got URL:", supabaseUrl);
  console.error("Got Key:", supabaseKey ? "****" : "null");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function checkEntitlements() {
  console.log("Checking entitlements for paid plans...");
  
  const { data, error } = await supabaseAdmin
    .from("entitlements")
    .select("user_id, plan, status, billing_reference_id, expires_at")
    .neq("plan", "free")
    .neq("plan", "trial")
    .order("expires_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching entitlements:", error);
    return;
  }

  console.log(`Found ${data.length} paid entitlements.`);
  data.forEach((ent) => {
    console.log(`User: ${ent.user_id}, Plan: ${ent.plan}, Status: ${ent.status}, Ref: ${ent.billing_reference_id}`);
  });
}

checkEntitlements();

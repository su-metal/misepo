import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectSchema() {
  console.log("Inspecting 'apps' table...");
  const { data: appsSchema, error: appsErr } = await supabase.rpc('get_table_columns', { table_name: 'apps' });
  if (appsErr) {
    // Fallback if RPC doesn't exist: simple query
    console.log("RPC failed, trying raw query...");
    const { data: cols, error: colErr } = await supabase.from('apps').select('*').limit(1);
    if (!colErr && cols.length > 0) {
      console.log("Sample apps record:", cols[0]);
    } else {
        console.error("Failed to query apps:", colErr);
    }
  } else {
    console.log("Apps Columns:", appsSchema);
  }

  console.log("\nInspecting 'entitlements' table...");
  const { data: entCols, error: entErr } = await supabase.from('entitlements').select('*').limit(1);
  if (!entErr && entCols.length > 0) {
    console.log("Sample entitlements record:", entCols[0]);
  } else {
    console.error("Failed to query entitlements:", entErr);
  }
}

inspectSchema();

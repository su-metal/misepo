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

async function listApps() {
  const { data, error } = await supabase.from('apps').select('*');
  if (error) {
    console.error("Error listing apps:", error);
  } else {
    console.log("Apps List:", JSON.stringify(data, null, 2));
  }
}

listApps();

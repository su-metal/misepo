import { Stripe } from "stripe";
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function checkStripeSub(subId: string) {
  console.log(`Checking Stripe Sub: ${subId}`);
  try {
    const sub = await stripe.subscriptions.retrieve(subId);
    console.log("Sub Object Type:", sub.object);
    console.log("Full JSON:", JSON.stringify(sub, null, 2));

    const firstItem = sub.items?.data?.[0];
    if (!firstItem) {
      console.log("No subscription items found.");
      return;
    }

    console.log("Current Period Start (Raw):", firstItem.current_period_start);
    console.log("Current Period End (Raw):", firstItem.current_period_end);

    if (firstItem.current_period_start) {
      console.log(
        "Current Period Start (ISO):",
        new Date(firstItem.current_period_start * 1000).toISOString()
      );
    }
    
    // Check if it's actually an active subscription
  } catch (e) {
    console.error("Error retrieving subscription:", e);
  }
}

// Replace with one of the IDs found
const subId = "sub_1SwgZjAwsmpNf1MuC7Mnml3h"; 
checkStripeSub(subId);

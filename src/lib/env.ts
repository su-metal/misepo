const requiredEnvVars = ["APP_ID"] as const;

function ensureEnvVar(key: (typeof requiredEnvVars)[number]) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  APP_ID: ensureEnvVar("APP_ID"),
} as const;

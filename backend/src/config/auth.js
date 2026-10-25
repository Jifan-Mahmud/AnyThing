import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// ── MongoDB native client for better-auth adapter ────────────────────────────
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db();

// ── better-auth instance ─────────────────────────────────────────────────────
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 5000}`,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  // Trust ALL possible frontend origins — better-auth uses this to set
  // Access-Control-Allow-Origin on every /api/auth/* response automatically.
  trustedOrigins: [
    process.env.FRONTEND_URL,
    "https://any-thing-three.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].filter(Boolean),
});


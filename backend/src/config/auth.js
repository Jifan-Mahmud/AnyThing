import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// ── MongoDB native client for better-auth adapter ────────────────────────────
// better-auth uses its OWN collections (users, sessions, accounts, etc.)
// alongside our Mongoose models — they coexist in the same database.
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(); // uses the database name from the URI

// ── better-auth instance ─────────────────────────────────────────────────────
export const auth = betterAuth({
  // The canonical base URL of this API server
  baseURL: process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 5000}`,

  // Secret used to sign session tokens / cookies
  secret: process.env.BETTER_AUTH_SECRET,

  // Where better-auth stores its own users/sessions/accounts
  database: mongodbAdapter(db),

  // Enable email + password authentication strategy
  emailAndPassword: {
    enabled: true,
  },

  // Trust the frontend origin for cross-origin cookie handling
  trustedOrigins: [process.env.FRONTEND_URL],
});

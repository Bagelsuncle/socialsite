import { neon } from "@neondatabase/serverless";

// Initialize the database connection
const db = neon(process.env.DATABASE_URL);

// Export the sql function for use in API routes
export { db as sql };

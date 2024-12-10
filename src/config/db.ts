import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production' // Enable SSL only in production
      ? { rejectUnauthorized: false } // Accept self-signed certificates
      : undefined, // Disable SSL locally or for non-SSL environments
});

export default pool;

import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

export const postgresPool = new Pool({
  connectionString: process.env.PG_URI,
  ssl: { rejectUnauthorized: false },
});

export const connectPostgres = async () => {
  try {
    await postgresPool.query('SELECT NOW()');
    console.log('✅ PostgreSQL Connected Successfully!');
  } catch (error) {
    console.error('❌ PostgreSQL Connection Failed:', error.message);
  }
};
import { Pool } from 'pg';

const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'rides',
  password: 'password',
  port: 5432,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

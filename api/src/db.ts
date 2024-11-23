import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'rides',
  port: 5234,
});

export const query = (sql: string, params?: any[]) => pool.execute(sql, params);
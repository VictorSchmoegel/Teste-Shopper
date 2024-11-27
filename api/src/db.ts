import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'password',
  database: 'rides',
  port: 3306,
});

export const query = (sql: string, params?: any[]) => pool.execute(sql, params);
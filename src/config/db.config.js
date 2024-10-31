import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "backend_task",
  password: "12345678",
  waitForConnections: true,
  connectionLimit: 8,
  queueLimit: 0,
});

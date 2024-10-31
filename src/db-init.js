import { pool } from "./config/db.config.js";

export async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const createItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item VARCHAR(255) NOT NULL UNIQUE
      )
    `;

    const createCombinationsTableQuery = `
      CREATE TABLE IF NOT EXISTS combinations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        combination JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createResponsesTableQuery = `
      CREATE TABLE IF NOT EXISTS responses (
        id VARCHAR(255) PRIMARY KEY,
        combination_id INT NOT NULL,
        FOREIGN KEY (combination_id) REFERENCES combinations(id)
      )
    `;

    await connection.query(createItemsTableQuery);
    await connection.query(createCombinationsTableQuery);
    await connection.query(createResponsesTableQuery);

    await connection.commit();
    console.log("Database initialized");
  } catch (error) {
    await connection.rollback();
    console.error("Database initialization failed:", error);
  } finally {
    connection.release();
  }
}

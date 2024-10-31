import { pool } from "../config/db.config.js";

export async function findLabel(label) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT id FROM items WHERE item = ?",
      [label]
    );
    return rows.length > 0;
  } finally {
    connection.release();
  }
}

export async function storeLabel(label) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "INSERT INTO items (item) VALUES (?)",
      [label]
    );
    return result.insertId;
  } catch (error) {
    console.error("Failed to store label:", error);
  } finally {
    connection.release();
  }
}

// export async function findResponseByCustomId(customId) {
//   const connection = await pool.getConnection();
//   try {
//     const [rows] = await connection.query(
//       "SELECT id FROM responses WHERE id = ?",
//       [customId]
//     );
//     return rows.length > 0 ? rows[0].id : null;
//   } finally {
//     connection.release();
//   }
// }

export async function getCombinationByResponseId(responseId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT c.id AS combinationId, c.combination FROM combinations c
       JOIN responses r ON r.combination_id = c.id
       WHERE r.id = ?`,
      [responseId]
    );

    if (rows.length > 0) {
      let parsedCombination;
      console.log(rows[0].combination);
      try {
        parsedCombination = JSON.parse(rows[0].combination);
      } catch (error) {
        console.error("Failed to parse combination as JSON:", error);
        throw new Error("Combination data is not valid JSON format");
      }

      return {
        combinationId: rows[0].combinationId,
        combination: parsedCombination,
      };
    }
    return null;
  } finally {
    connection.release();
  }
}

export async function storeCombination(combination) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const jsonCombination = JSON.stringify(combination);

    const [result] = await connection.query(
      "INSERT INTO combinations (combination) VALUES (?)",
      [jsonCombination]
    );
    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function storeResponse(customId, combinationId) {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      "INSERT INTO responses (id, combination_id) VALUES (?, ?)",
      [customId, combinationId]
    );
  } catch (error) {
    console.error("Failed to store response:", error);
  } finally {
    connection.release();
  }
}

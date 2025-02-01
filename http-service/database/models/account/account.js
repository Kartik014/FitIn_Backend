import { pool } from "../../db.js";

const account = {
  createAccountTable: async () => {
    const queryText = `
      CREATE TABLE IF NOT EXISTS account (
        userid VARCHAR(255) PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL,
        username VARCHAR(50) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
        bio VARCHAR(255),
        ispublic INT DEFAULT 1,
        isverified INT DEFAULT 0,
        thumbnailimage VARCHAR(500)
      );
    `;
    try {
      const client = await pool.connect();
      await client.query(queryText);
      console.log("Account table created successfully");
    } catch (err) {
      console.error("Error creating account table:", err);
      throw err;
    }
  },

  addAccount: async (accountDTO) => {
    const queryText = `
      INSERT INTO account (userid, name, username, bio, ispublic, isverified, thumbnailimage)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      accountDTO.userid,
      accountDTO.name,
      accountDTO.username,
      accountDTO.bio,
      accountDTO.ispublic,
      accountDTO.isverified,
      accountDTO.thumbnailimage,
    ];

    try {
      const client = await pool.connect();
      const result = await client.query(queryText, values);
      client.release();
      return result.rows[0];
    } catch (err) {
      console.error("Error adding account:", err);
      throw err;
    }
  },

  updateAccount: async (accountDTO) => {
    const queryText = `
      UPDATE account
      SET 
        name = COALESCE($1, name),
        username = COALESCE($2, username),
        bio = COALESCE($3, bio),
        ispublic = COALESCE($4, ispublic),
        isverified = COALESCE($5, isverified),
        thumbnailimage = COALESCE($6, thumbnailimage)
      WHERE userid = $7
      RETURNING *;
    `;

    const values = [
      accountDTO.name,
      accountDTO.username,
      accountDTO.bio,
      accountDTO.ispublic,
      accountDTO.isverified,
      accountDTO.thumbnailimage,
      accountDTO.userid,
    ];

    try {
      const client = await pool.connect();
      const result = await client.query(queryText, values);
      client.release();
      return result.rows[0];
    } catch (err) {
      console.error("Error updating account:", err);
      throw err;
    }
  },

  deleteAccount: async (userid) => {
    const queryText = `
      DELETE FROM account
      WHERE userid = $1
      RETURNING *;
    `;

    try {
      const client = await pool.connect();
      const result = await client.query(queryText, [userid]);
      client.release();
      return result.rows[0]; // Returns the deleted account details, or null if not found.
    } catch (err) {
      console.error("Error deleting account:", err);
      throw err;
    }
  },

  getAccount: async (userid) => {
    const queryText = `
      SELECT * FROM account
      WHERE userid = $1;
    `;

    try {
      const client = await pool.connect();
      const result = await client.query(queryText, [userid]);
      client.release();
      return result.rows[0]; // Returns the account details or null if not found.
    } catch (err) {
      console.error("Error fetching account:", err);
      throw err;
    }
  },
};

export default account;

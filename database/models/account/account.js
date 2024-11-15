import { pool } from "../../db.js";

const account = {
    createAccountTable: async () => {
        const queryText = `
            CREATE TABLE IF NOT EXISTS followers (
                userID VARCHAR(255) PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(50) NOT NULL,
                username VARCHAR(50) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
                bio VARCHAT(255),
                ispublic INT DEFAULT 1,
                isverified INT DEFUALT 0,
                thumbnailimage VARCHAR(255),
            );
        `;
        try {
            const client = await pool.connect();
            await client.query(queryText);
            console.log("Account table created successfully");
        } catch (err) {
            console.error("Error creating account table: ", err);
            throw err;
        }
    }
}
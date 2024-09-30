import pool from "../db.js";

const user = {
    createUserTable: async () => {
        const queryText = `
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(255) PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                session VARCHAR(255),
                role VARCHAR(50),
                mobile_number VARCHAR(15),
                gender VARCHAR(10),
                dob DATE
            );
        `;

        try {
            const client = await pool.connect();
            await client.query(queryText);
            console.log('Users table created successfully');
            client.release();
        } catch (err) {
            console.error('Error creating users table: ', err);
            throw err;
        }
    },
    
    addUser: async (userDTO) => {
        const queryText = `
            INSERT INTO users (id, username, email, password, session, role, mobile_number, gender, dob)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;

        const values = [
            userDTO.id,
            userDTO.username,
            userDTO.email,
            userDTO.password,
            userDTO.session,
            userDTO.role,
            userDTO.mobileNumber,
            userDTO.gender,
            userDTO.dob
        ];

        try {
            const client = await pool.connect();
            const result = await client.query(queryText, values);
            client.release();
            return result.rows[0];
        } catch (err) {
            console.error('Error inserting user:', err);
            throw err;
        }
    }
}

export default user;
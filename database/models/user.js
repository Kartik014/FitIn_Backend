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
    },

    getUserbyEmailOrUsername: async (userDTO) => {
        const queryText = `
        SELECT * FROM users WHERE email = $1 OR username = $2;
        `;

        const values = [userDTO.email, userDTO.username];

        try {
            const client = await pool.connect();
            const result = await client.query(queryText, values);
            client.release();
            return result.rows[0];
        } catch (err) {
            console.error('Error getting user:', err);
            throw err;
        }
    },

    updateUserLogIn: async (userDTO) => {
        const queryText = `
            UPDATE users
            SET session = $1
            WHERE id = $2
            RETURNING *;
        `;

        const values = [userDTO.session, userDTO.id];

        try {
            const client = await pool.connect();
            const result = await client.query(queryText, values);
            client.release();
            return result.rows[0];
        } catch (err) {
            console.error('Error updating user session:', err);
            throw err;
        }
    },

    updateUserProfile: async (userDTO) => {
        const updates = [];
        const values = [];
        let index = 1;

        if (userDTO.username) {
            updates.push(`username = $${index++}`);
            values.push(userDTO.username);
        }
        if (userDTO.password) {
            updates.push(`password = $${index++}`);
            values.push(userDTO.password);
        }
        if (userDTO.mobileNumber) {
            updates.push(`mobile_number = $${index++}`);
            values.push(userDTO.mobileNumber);
        }
        if (userDTO.gender) {
            updates.push(`gender = $${index++}`);
            values.push(userDTO.gender);
        }
        if (userDTO.dob) {
            updates.push(`dob = $${index++}`);
            values.push(userDTO.dob);
        }
        if (userDTO.session) {
            updates.push(`session = $${index++}`);
            values.push(userDTO.session);
        }

        if (updates.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(userDTO.id);

        const queryText = `
            UPDATE users
            SET ${updates.join(', ')}
            WHERE id = $${index}
            RETURNING *;
        `;

        try {
            const client = await pool.connect();
            const result = await client.query(queryText, values);
            client.release();
            return result.rows[0];
        } catch (err) {
            console.error('Error updating user profile:', err);
            throw err;
        }
    }
}

export default user;
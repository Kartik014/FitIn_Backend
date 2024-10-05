import pool from "../../db.js";

const otp = {
    createOtpTable: async () => {
        const queryText = `
            CREATE TABLE IF NOT EXISTS otp (
                otp VARCHAR(6) NOT NULL,
                expiration_time TIMESTAMP NOT NULL,
                user_id VARCHAR(255) NOT NULL,
                type VARCHAR(20),
                is_verified BOOLEAN DEFAULT FALSE
            );
        `;

        try {
            const client = await pool.connect();
            await client.query(queryText);
            console.log('OTP table created successfully');
            client.release();
        } catch (err) {
            console.error('Error creating OTP table: ', err);
            throw err;
        }
    },

    addOtp: async (otpDTO) => {
        const queryText = `
            INSERT INTO otp (otp, expiration_time, user_id, type)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const values = [otpDTO.otp, otpDTO.expirationTime, otpDTO.userId, otpDTO.type];

        try {
            const client = await pool.connect();
            const result = await client.query(queryText, values);
            client.release();
            return result.rows[0];
        } catch (err) {
            console.error('Error adding OTP: ', err);
            throw err;
        }
    },

    verifyOtp: async (otpDTO) => {
        const queryText = `
            UPDATE otp
            SET is_verified = TRUE
            WHERE otp = $1 AND user_id = $2 AND expiration_time > NOW() AND is_verified = FALSE
            RETURNING *;
        `;

        const values = [otpDTO.otp, otpDTO.userId];

        try {
            const client = await pool.connect();
            const res = await client.query(queryText, values);
            client.release();

            if (res.rows.length === 0) {
                throw new Error('Invalid or expired OTP');
            }

            return res.rows[0];
        } catch (err) {
            console.error('Error verifying OTP: ', err);
            throw err;
        }
    },

    isOtpVerified: async (otpDTO) => {
        const queryText = `
            SELECT * FROM otp
            WHERE user_id = $1 AND type = $2;
        `;

        const values = [otpDTO.userId, otpDTO.type];

        try {
            const client = await pool.connect();
            const res = await client.query(queryText, values);
            client.release();

            if (res.rows.length === 0) {
                throw new Error('OTP not found');
            }

            return res.rows[0].is_verified;
        } catch (err) {
            console.error('Error checking OTP verification status: ', err);
            throw err;
        }
    }
}

export default otp;
import { pool } from "../../db.js";
import redisClient from "../../../redis/redisClient.js"

const calls = {
    createCallsTable: async () => {
        const queryText = `
                CREATE TABLE IF NOT EXISTS calls (
                    callid VARCHAR(255) PRIMARY KEY NOT NULL,
                    callerID VARCHAR(255) NOT NULL,
                    receiverID VARCHAR(255) NOT NULL,
                    callername VARCHAR(50) NOT NULL,
                    receivername VARCHAR(50) NOT NULL,
                    roomID VARCHAR(255),
                    starttime TIMESTAMPTZ DEFAULT NOW(),
                    endtime TIMESTAMPTZ,
                    status VARCHAR(50) NOT NULL,
                    calltype VARCHAR(50) NOT NULL,
                    duration INTEGER DEFAULT 0
                );
            `;
        try {
            const client = await pool.connect();
            await client.query(queryText);
            console.log("Calls table created successfully");
            client.release();
        } catch (err) {
            console.error("Error creating calls table: ", err);
            throw err;
        }
    },

    bulkCallSave: async () => {
        try {
            const keys = await redisClient.keys('calls:*');

            if (keys.length === 0) {
                return;
            }

            const allData = [];
            for (const key of keys) {
                const redisData = await redisClient.lrange(key, 0, -1);
                const parsedData = redisData.map(entry => JSON.parse(entry));
                allData.push(...parsedData);
            }

            const data = allData.filter(row => row.endtime !== null);

            if (data.length > 0) {
                const queryText = `
                        INSERT INTO your_table_name (callid, callerID, receiverID, callername, receivername, roomID, starttime, endtime, status, calltype, duration)
                        VALUES
                        ${data.map(row => `(${row.callid}, ${row.callerID}, ${row.receiverID}, ${row.callername}, ${row.receivername}, ${row.roomID}, ${row.starttime}, ${row.endtime}, ${row.status}, ${row.calltype}, ${row.duration})`).join(', ')};
                    `;

                try {
                    const client = await pool.connect();
                    await client.query(queryText);
                    client.release();
                } catch (err) {
                    console.error("Error adding call: ", err);
                    throw err;
                }
                console.log(`Successfully inserted ${data.length} records into PostgreSQL`);
            } else {
                console.log('No data with valid endtime to save.');
            }

            const savedKeys = data.map(row => row.callid);
            if (savedKeys.length > 0) {
                await redisClient.del(...savedKeys);
            }

        } catch (error) {
            console.error('Error during bulk save operation:', error);
        }
    },

    getCallHistory: async (roomID, limit) => {
        const queryText = `
                SELECT * FROM calls
                WHERE roomID = $1
                ORDER BY starttime DESC
                LIMIT $2;
            `;
        try {
            const client = await pool.connect();
            const result = await client.query(queryText, [roomID, limit]);
            client.release();
            return result.rows;
        } catch (err) {
            console.error("Error fetching call history: ", err);
            throw err;
        }
    }
}

export default calls;
import pool from "../../db.js";

const followers = {
    createFollowersTable: async () => {
        const queryText = `
            CREATE TABLE IF NOT EXISTS followers (
                id VARCHAR(255) PRIMARY KEY,
                followerid VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                followedbyid VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                requeststatus INT DEFAULT 0
            );
        `;

        try {
            const client = await pool.connect();
            await client.query(queryText);
            console.log('Followers table created successfully');
            client.release();
        } catch (err) {
            console.error('Error creating followers table: ', err);
            throw err;
        }
    },

    addFollower: async (followersDTO) => {
        const queryText = `
            INSERT INTO followers (id, followerid, followedbyid)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const values = [
            followersDTO.id,
            followersDTO.followerid,
            followersDTO.followedbyid
        ];

        try {
            const client = await pool.connect();
            const result = await client.query(queryText, values);
            client.release();
            return result.rows[0];
        } catch (err) {
            console.error('Error instering follower:', err);
            throw err;
        }
    },

    getFollowRequest: async (followersDTO) => {
        const queryText = `
            SELECT * FROM followers
            WHERE followerid = $1 AND followedbyid = $2;
        `;

        const values = [followersDTO.followerid, followersDTO.followedbyid];

        try {
            const client = await pool.connect();
            const result = await client.query(queryText, values);
            return result.rows[0];
        } catch (err) {
            console.error('Error in getting existing follow request: ', err);
            throw err;
        }
    },

    getFollowers: async (followersDTO, limit, offset) => {
        const queryText = `
            SELECT u.id, u.username, f.timestamp,
            COUNT(*) OVER() AS totalcount FROM followers f
            INNER JOIN users u ON f.followedbyid = u.id
            WHERE f.followerid = $1 AND requeststatus = $2
            LIMIT $3 OFFSET $4;
        `;

        const values = [
            followersDTO.followerid,
            followersDTO.requeststatus,
            limit || 100,
            offset || 0
        ];

        try {
            const client = await pool.connect();
            const result = await client.query(queryText, values);
            client.release();
            if (result.rows.length > 0) {
                const totalcount = result.rows[0].totalcount;
                const followerData = result.rows.map(row => ({
                    id: row.id,
                    username: row.username,
                    timestamp: row.timestamp
                }));
                return { totalcount, followerData };
            }
            return { totalcount: 0, followerData: [] };
        } catch (err) {
            console.error('Error fetching followers data: ', err);
            throw err;
        }
    },

    getFollowing: async (followersDTO, limit, offset) => {
        const queryText = `
            SELECT u.id, u.username, f.timestamp,
            COUNT(*) OVER() AS totalcount FROM followers f
            INNER JOIN users u ON f.followerid = u.id 
            WHERE f.followedbyid = $1 AND requeststatus = $2
            LIMIT $3 OFFSET $4;
        `;

        const values = [
            followersDTO.followedbyid,
            followersDTO.requeststatus,
            limit || 100,
            offset || 0
        ];

        try {
            const client = await pool.connect();
            const result = await client.query(queryText, values);
            client.release();
            if (result.rows.length > 0) {
                const totalcount = result.rows[0].totalcount;
                const followingData = result.rows.map(row => ({
                    id: row.id,
                    username: row.username,
                    timestamp: row.timestamp
                }));
                return { totalcount, followingData };
            }
            return { totalCount: 0, followingData: [] };
        } catch (err) {
            console.error('Error fetching following data: ', err);
            throw err;
        }
    },

    updateFollowRequest: async (followersDTO) => {
        let queryText = "";

        if (followersDTO.requeststatus == 1) {
            queryText = `
                UPDATE followers
                SET requeststatus = 1
                WHERE id = $1
                RETURNING *;
            `;
        } else if (followersDTO.requeststatus == 2) {
            queryText = `
                DELETE FROM followers
                WHERE id = $1
                RETURNING *;
            `;
        }

        const values = [followersDTO.id];

        try {
            const client = await pool.connect();
            const result = await client.query(queryText, values);
            client.release();
            return result.rows[0];
        } catch (err) {
            console.error('Error updating the request status: ', err);
            throw err;
        }
    },

    removeFollowers: async (followersDTO) => {
        const queryText = `
            DELETE FROM followers
            WHERE id = $1 AND requeststatus = 1
            RETURNING *;
        `;

        const values = [
            followersDTO.id
        ]

        try {
            const client = await pool.connect();
            const result = await client.query(queryText, values);
            client.release();
            return result.rows[0];
        } catch (err) {
            console.log('Error while removing follower: ', err);
            throw err;
        }
    }
}

export default followers;
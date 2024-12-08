import { pool } from "../../db.js";

const posts = {
  // Create the posts table if it doesn't exist
  createPostsTable: async () => {
    const queryText = `
            CREATE TABLE IF NOT EXISTS posts (
                postid SERIAL PRIMARY KEY,
                userid VARCHAR(255) NOT NULL,
                caption TEXT NOT NULL,
                postingtime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                location VARCHAR(255), -- Optional
                medialink TEXT, -- Optional
                filetype VARCHAR(50) -- Optional
            );
        `;

    try {
      const client = await pool.connect();
      await client.query(queryText);
      console.log("Posts table created successfully");
      client.release();
    } catch (err) {
      console.error("Error creating posts table:", err);
      throw err;
    }
  },

  // Add a new post
  addPost: async (postDTO) => {
    const queryText = `
            INSERT INTO posts (userid, caption, postingtime, location, medialink, filetype)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

    const values = [
      postDTO.userid,
      postDTO.caption,
      postDTO.postingtime,
      postDTO.location,
      postDTO.medialink,
      postDTO.filetype,
    ];

    try {
      const client = await pool.connect();
      const result = await client.query(queryText, values);
      client.release();
      return result.rows[0];
    } catch (err) {
      console.error("Error inserting post:", err);
      throw err;
    }
  },

  // Get posts by user
  getPostsByUser: async (userid, limit = 10, offset = 0) => {
    const queryText = `
            SELECT * FROM posts
            WHERE userid = $1
            ORDER BY postingtime DESC
            LIMIT $2 OFFSET $3;
        `;

    const values = [userid, limit, offset];

    try {
      const client = await pool.connect();
      const result = await client.query(queryText, values);
      client.release();
      return result.rows;
    } catch (err) {
      console.error("Error fetching posts by user:", err);
      throw err;
    }
  },

  // Get all posts for a list of users for the feed
  getPostsForUserFeed: async (currentUserId, limit = 20, offset = 0) => {
    const queryText = `
      SELECT 
        p.*,
        a.name,
        a.username,
        a.isverified,
        a.thumbnailimage
      FROM posts p
      INNER JOIN account a ON p.userid = a.userid
      WHERE p.userid = ANY (
        SELECT followedbyid 
        FROM followers 
        WHERE followerid = $1 AND requeststatus = 1
      )
      ORDER BY p.postingtime DESC
      LIMIT $2 OFFSET $3;
  `;

    const values = [currentUserId, limit, offset];

    try {
      const client = await pool.connect();
      const result = await client.query(queryText, values);
      client.release();
      return result.rows;
    } catch (err) {
      console.error("Error fetching posts with user info for feed:", err);
      throw err;
    }
  },

  // Delete a post
  deletePost: async (postid) => {
    const queryText = `
            DELETE FROM posts
            WHERE postid = $1
            RETURNING *;
        `;

    const values = [postid];

    try {
      const client = await pool.connect();
      const result = await client.query(queryText, values);
      client.release();
      return result.rows[0];
    } catch (err) {
      console.error("Error deleting post:", err);
      throw err;
    }
  },
};

export default posts;

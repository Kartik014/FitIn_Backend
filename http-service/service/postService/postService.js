import path from "path";
import { pool } from "../../database/db.js";
import bucket from "../../firebase.js";

// Function to create a post
const createPost = async ({
  userid,
  caption,
  postingtime,
  location,
  mediafile,
}) => {
  let mediafilelink = null;
  let filetype = null;

  // Ensure the 'posts' table exists; if not, create it
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      postid SERIAL PRIMARY KEY,
      userid VARCHAR(255) NOT NULL,
      caption TEXT NOT NULL,
      postingtime TIMESTAMP NOT NULL,
      location VARCHAR(255), -- Optional
      medialink TEXT, -- Optional
      filetype VARCHAR(50) -- Optional
    );
  `);

  // If there's a media file, upload it to Firebase
  if (mediafile) {
    const fileName = `${Date.now()}_${mediafile.originalname}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: mediafile.mimetype,
      },
    });

    await new Promise((resolve, reject) => {
      blobStream.on("finish", () => {
        mediafilelink = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(fileName)}?alt=media`;
        filetype = path.extname(fileName);
        resolve();
      });
      blobStream.on("error", reject);
      blobStream.end(mediafile.buffer);
    });
  }

  // Insert post data into PostgreSQL
  const result = await pool.query(
    `INSERT INTO posts (userid, caption, postingtime, location, medialink, filetype) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING postId`,
    [userid, caption, postingtime, location || null, mediafilelink, filetype]
  );

  return result.rows[0]; // Returning the created post ID
};

export { createPost };

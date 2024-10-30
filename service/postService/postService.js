import bucket from "../../firebase.js"; // Firebase configuration
import path from "path";
import { pool } from "../../database/db.js";

// Function to create a post
const createPost = async ({
  userId,
  caption,
  postingTime,
  location,
  mediaFile,
}) => {
  let mediaFileLink = null;
  let fileType = null;

  // Ensure the 'posts' table exists; if not, create it
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      postId SERIAL PRIMARY KEY,
      userId VARCHAR(255) NOT NULL,
      caption TEXT NOT NULL,
      postingTime TIMESTAMP NOT NULL,
      location VARCHAR(255), -- Optional
      mediaLink TEXT, -- Optional
      fileType VARCHAR(50) -- Optional
    );
  `);

  // If there's a media file, upload it to Firebase
  if (mediaFile) {
    const fileName = `${Date.now()}_${mediaFile.originalname}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: mediaFile.mimetype,
      },
    });

    await new Promise((resolve, reject) => {
      blobStream.on("finish", () => {
        mediaFileLink = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        fileType = path.extname(fileName);
        resolve();
      });
      blobStream.on("error", reject);
      blobStream.end(mediaFile.buffer);
    });
  }

  // Insert post data into PostgreSQL
  const result = await pool.query(
    `INSERT INTO posts (userId, caption, postingTime, location, mediaLink, fileType) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING postId`,
    [userId, caption, postingTime, location || null, mediaFileLink, fileType]
  );

  return result.rows[0]; // Returning the created post ID
};

export { createPost };

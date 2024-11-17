import pkg from "pg";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
  } else {
    console.log("Database connected");
    release();
  }
});

// MongoDB connection setup
const mongoURI = process.env.MONGODB;
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Database connected"))
  .catch((error) => console.error("Error connecting to MongoDB", error));

export { pool, mongoose };

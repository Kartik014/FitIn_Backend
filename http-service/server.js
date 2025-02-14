import httpApp from "./app.js";
import { pool } from "./database/db.js";
import followers from "./database/models/followers/followers.js";
import otp from "./database/models/otp/otp.js";
import user from "./database/models/user/user.js";
import calls from "./database/models/calls/calls.js";
import dotenv from "dotenv";
import consumer from "./kafka/kafkaConsumer.js";
import account from "./database/models/account/account.js";
import posts from "./database/models/posts/posts.js";

dotenv.config();

const initializeDatabase = async () => {
  try {
    await user.createUserTable();
    await otp.createOtpTable();
    await followers.createFollowersTable();
    await calls.createCallsTable();
    await account.createAccountTable();
    await posts.createPostsTable();
    console.log("Database initialized");
    await consumer.newUserConsumer();
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
};

const startHttpServer = async () => {
  const httpPort = process.env.HTTP_PORT || 3000;
  const server = httpApp.listen(httpPort, "0.0.0.0", () => {
    console.log(`HTTP Server is running on port ${httpPort}`);
  });
};

const startAllServers = async () => {
  await initializeDatabase();

  startHttpServer();
};

startAllServers();

import httpApp from "./app.js";
import { chatApp, initializeChatServer } from "./chatApp.js";
import { callApp, initializeCallServer } from "./callApp.js";
import { pool } from "./database/db.js";
import followers from "./database/models/followers/followers.js";
import otp from "./database/models/otp/otp.js";
import user from "./database/models/user/user.js";
import calls from "./database/models/calls/calls.js";
import dotenv from "dotenv";
import consumer from "./kafka/kafkaConsumer.js";
import startBulkChatSaveCron from "./utils/bulkSaveMessage.js";
import startBulkCallSaveCron from "./utils/bulkSaveCall.js";

dotenv.config();

const initializeDatabase = async () => {
  try {
    await user.createUserTable();
    await otp.createOtpTable();
    await followers.createFollowersTable();
    await calls.createCallsTable();
    console.log("Database initialized");
    await consumer.newUserConsumer();
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
};

const startHttpServer = async () => {
  const httpPort = process.env.HTTP_PORT || 3000;
  const server = httpApp.listen(httpPort, () => {
    console.log(`HTTP Server is running on port ${httpPort}`);
  });
};

const startChatServer = async () => {
  const chatPort = process.env.CHAT_PORT || 3001;
  const chatServer = chatApp.listen(chatPort, () => {
    console.log(`CHAT Server is running on port ${chatPort}`);
  });
  initializeChatServer(chatServer);
};

const startCallServer = async () => {
  const callPort = process.env.CALL_PORT || 3002;
  const callServer = callApp.listen(callPort, () => {
    console.log(`CALL Server is running on port ${callPort}`);
  });
  initializeCallServer(callServer);
};

const startAllServers = async () => {
  await initializeDatabase();

  startBulkChatSaveCron();
  startBulkCallSaveCron();

  startHttpServer();
  startChatServer();
  startCallServer();
};

startAllServers();

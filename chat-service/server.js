import { chatApp, initializeChatServer } from "./chatApp.js";
import { pool } from "./database/db.js";
import dotenv from "dotenv";
import startBulkChatSaveCron from "./utils/bulkSaveMessage.js";

dotenv.config();

const initializeDatabase = async () => {
  try {
    console.log("Database initialized");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
};

const startChatServer = async () => {
  const chatPort = process.env.CHAT_PORT || 3001;
  const chatServer = chatApp.listen(chatPort, () => {
    console.log(`CHAT Server is running on port ${chatPort}`);
  });
  initializeChatServer(chatServer);
};

const startAllServers = async () => {
  await initializeDatabase();

  startBulkChatSaveCron();
  
  startChatServer();
};

startAllServers();

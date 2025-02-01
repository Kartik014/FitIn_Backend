import { callApp, initializeCallServer } from "./callApp.js";
import { pool } from "./database/db.js";
import calls from "./database/models/calls/calls.js";
import dotenv from "dotenv";
import startBulkCallSaveCron from "./utils/bulkSaveCall.js";

dotenv.config();

const initializeDatabase = async () => {
  try {
    await calls.createCallsTable();
    console.log("Database initialized");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
};

const startCallServer = async () => {
  const callPort = process.env.CALL_PORT || 3002;
  const callServer = callApp.listen(callPort, '0.0.0.0', () => {
    console.log(`CALL Server is running on port ${callPort}`);
  });
  initializeCallServer(callServer);
};

const startAllServers = async () => {
  await initializeDatabase();

  startBulkCallSaveCron();

  startCallServer();
};

startAllServers();
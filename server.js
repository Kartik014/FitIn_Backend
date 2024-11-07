import app from "./app.js";
import { pool } from "./database/db.js";
import followers from "./database/models/followers/followers.js";
import otp from "./database/models/otp/otp.js";
import user from "./database/models/user/user.js";
import dotenv from "dotenv";
import consumer from "./kafka/kafkaConsumer.js";
import { Server } from "socket.io";
import socketRoute from "./routers/sockets.js";
import startBulkSaveCron from "./utils/bulkSaveMessage.js";

dotenv.config();

const port = process.env.SERVER_PORT;

const initializeDatabase = async () => {
  try {
    await user.createUserTable();
    await otp.createOtpTable();
    await followers.createFollowersTable();
    console.log('Database initialized');
    await consumer.newUserConsumer();
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  await initializeDatabase();
  startBulkSaveCron();

  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
  socketRoute(io);
};

startServer();

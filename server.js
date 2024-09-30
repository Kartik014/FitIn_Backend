import app from "./app.js";
import pool from "./database/db.js";
import user from "./database/models/user.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.SERVER_PORT;

const initializeDatabase = async () => {
    try {
        await user.createUserTable();
        console.log('Database initialized');
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
};

const startServer = async () => {
    await initializeDatabase();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();
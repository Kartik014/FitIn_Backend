import express from "express";
import xssClean from "xss-clean";
import authenticateToken from "../../middlewares/authenticateToken";
import { getChathistory } from "../controllers/chat/chatController.js";


const apiRouter = express.Router();

apiRouter
    .route('/getChatHistory')
    .get(authenticateToken, xssClean(), getChathistory());

export default apiRouter;
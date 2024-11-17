import express from "express";
import xssClean from "xss-clean";
import { getChathistory } from "../controllers/chat/chatController.js";
import authenticateSocketToken from "../middlewares/authenticateSocketToken.js";


const apiRouter = express.Router();

apiRouter
    .route('/getChatHistory')
    .get(authenticateSocketToken, xssClean(), getChathistory());

export default apiRouter;
import express from "express";
import { createUser, getUser, updateUser } from "../controllers/user_controller.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const apiRouter = express.Router();

apiRouter
    .route('/signUp')
    .post(createUser)

apiRouter
    .route('/logIn')
    .post(getUser)

apiRouter
    .route('/update-profile')
    .put(authenticateToken, updateUser)

export default apiRouter;
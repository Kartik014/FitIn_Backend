import express from "express";
import { createUser, getUser, logoutUser, updateUser } from "../controllers/user_controller.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import xssClean from "xss-clean";

const apiRouter = express.Router();

apiRouter
    .route('/signUp')
    .post(xssClean(), createUser)

apiRouter
    .route('/logIn')
    .post(xssClean(), getUser)

apiRouter
    .route('/update-profile')
    .put(authenticateToken, xssClean(), updateUser)

apiRouter
    .route('/logout')
    .post(authenticateToken, xssClean(), logoutUser)

export default apiRouter;
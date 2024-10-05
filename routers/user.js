import express from "express";
import { createUser, deleteUser, getUser, logoutUser, updateUser } from "../controllers/user/user_controller.js";
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

apiRouter
    .route('/signOut')
    .post(authenticateToken, xssClean(), deleteUser)

export default apiRouter;
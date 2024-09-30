import express from "express";
import createUser from "../controllers/user_controller.js";

const apiRouter = express.Router();

apiRouter
    .route('/create-user')
    .post(createUser)

export default apiRouter;
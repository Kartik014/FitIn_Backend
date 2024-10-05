import express from "express";
import xssClean from "xss-clean";
import authenticateToken from "../middlewares/authenticateToken.js";
import { createOtp } from "../controllers/otp/otp_controller.js";

const apiRouter = express.Router();

apiRouter
    .route('/createOTP')
    .post(authenticateToken, xssClean(), createOtp)

export default apiRouter;
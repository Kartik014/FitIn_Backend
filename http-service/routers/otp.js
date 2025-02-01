import express from "express";
import xssClean from "xss-clean";
import authenticateToken from "../middlewares/authenticateToken.js";
import { createOtp, verifyOtp } from "../controllers/otp/otp_controller.js";

const apiRouter = express.Router();

apiRouter
    .route('/createOTP')
    .post(authenticateToken, xssClean(), createOtp)

apiRouter
    .route('/verifyOTP')
    .post(xssClean(), verifyOtp)

export default apiRouter;
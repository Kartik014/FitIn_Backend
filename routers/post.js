import { Router } from "express";
import upload from "../middlewares/multer.js"; // Import multer middleware
import { createPostHandler } from "../controllers/postController/postController.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import xssClean from "xss-clean";

const router = Router();

// Route to create a post
router.post("/create", authenticateToken, xssClean(), upload.single("mediaFile"), createPostHandler);

export default router;

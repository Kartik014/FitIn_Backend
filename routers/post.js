import { Router } from "express";
import upload from "../middlewares/multer.js"; // Import multer middleware
import { createPostHandler } from "../controllers/postController/postController.js";

const router = Router();

// Route to create a post
router.post("/create", upload.single("mediaFile"), createPostHandler);

export default router;

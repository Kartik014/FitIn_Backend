import { Router } from "express";
import upload from "../middlewares/multer.js"; // Import multer middleware
import {
  createPostHandler,
  deletePostHandler,
  getPostsByUserHandler,
  getPostsForUsersHandler,
} from "../controllers/postController/postController.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import xssClean from "xss-clean";

const router = Router();

// Route to create a post
router.post("/create", upload.single("mediafile"), createPostHandler);
router.get("/getUserPosts/:userid", getPostsByUserHandler);
router.get("/userfeed/:currentUserId", getPostsForUsersHandler);
router.delete("/deletePost/:postid", deletePostHandler);

export default router;

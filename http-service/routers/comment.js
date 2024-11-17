import express from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import xssClean from "xss-clean";
import {
  addComment,
  addReply,
  getComments,
} from "../controllers/comment/comment.js";

const router = express.Router();

// Route to add a new comment
router.post("/add", authenticateToken, xssClean(), addComment);

// Route to add a reply to a comment
router.post("/reply", authenticateToken, xssClean(), addReply);

// Route to get all comments for a specific post
router.get("/:postId", authenticateToken, xssClean(), getComments);

export default router;

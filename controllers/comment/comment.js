import Comment from "../../database/models/comment/commentModel.js";
import { CommentDTO, ReplyDTO } from "../../DTO/commentsDTO.js";
import commentService from "../../service/comment/commentService.js";

// Add a new comment
const addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const { id: userId } = req.user;

    const commentDTO = new CommentDTO(postId, userId, text);

    const newComment = await commentService.addComment(commentDTO);

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (err) {
    console.error("Error in addComment controller: ", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Add a reply to a comment
const addReply = async (req, res) => {
  try {
    const { commentId, text } = req.body;
    const { id: userId } = req.user;

    const replyDTO = new ReplyDTO(userId, text);

    const updatedComment = await commentService.addReply(commentId, replyDTO);

    res.status(201).json({
      message: "Reply added successfully",
      comment: updatedComment,
    });
  } catch (err) {
    console.error("Error in addReply controller: ", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Get all comments for a post
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await commentService.getComments(postId);

    res.status(200).json({
      message: "Comments retrieved successfully",
      comments,
    });
  } catch (err) {
    console.error("Error in getComments controller: ", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export { addComment, addReply, getComments };

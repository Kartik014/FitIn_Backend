import Comment from "../../database/models/comment/commentModel.js";

const commentService = {
  // Add a new comment
  addComment: async (commentDTO) => {
    try {
      const newComment = new Comment({
        postId: commentDTO.postId,
        userId: commentDTO.userId,
        text: commentDTO.text,
      });

      await newComment.save();
      return newComment;
    } catch (err) {
      console.error("Error in addComment service: ", err);
      throw err;
    }
  },

  // Add a reply to a comment
  addReply: async (commentId, replyDTO) => {
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new Error("Comment not found");
      }

      comment.replies.push({
        userId: replyDTO.userId,
        text: replyDTO.text,
        timestamp: replyDTO.timestamp,
      });

      await comment.save();
      return comment;
    } catch (err) {
      console.error("Error in addReply service: ", err);
      throw err;
    }
  },

  // Get all comments for a post
  getComments: async (postId) => {
    try {
      const comments = await Comment.find({ postId });
      return comments;
    } catch (err) {
      console.error("Error in getComments service: ", err);
      throw err;
    }
  },
};

export default commentService;

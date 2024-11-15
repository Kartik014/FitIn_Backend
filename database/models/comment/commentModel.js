import mongoose from "mongoose";

// reply schema
const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// comment schema
const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  replies: [replySchema], // Array of replies
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

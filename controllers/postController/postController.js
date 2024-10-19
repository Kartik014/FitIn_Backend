import { createPost } from "../../service/postService/postService.js";
// Controller function to handle post creation
export const createPostHandler = async (req, res) => {
  try {
    const { userId, caption, postingTime, location } = req.body;
    const mediaFile = req.file;

    const post = await createPost({
      userId,
      caption,
      postingTime,
      location,
      mediaFile,
    });

    res
      .status(201)
      .json({ postId: post.postId, message: "Post created successfully!" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

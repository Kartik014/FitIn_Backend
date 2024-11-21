import { createPost } from "../../service/postService/postService.js";
// Controller function to handle post creation
export const createPostHandler = async (req, res) => {
  try {
    const { userid, caption, postingtime, location } = req.body;
    const mediafile = req.file;

    const post = await createPost({
      userid,
      caption,
      postingtime,
      location,
      mediafile,
    });

    res
      .status(201)
      .json({ postId: post.postId, message: "Post created successfully!" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

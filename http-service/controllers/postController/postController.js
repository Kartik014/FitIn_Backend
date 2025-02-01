import PostDTO from "../../DTO/postDTO.js";
import bucket from "../../firebase.js";
import path from "path";
import postService from "../../service/postService/postService.js";

// Controller function to handle post creation
export const createPostHandler = async (req, res) => {
  try {
    const { userid, caption, postingtime, location } = req.body;
    const mediafile = req.file;

    let mediafilelink = null;
    let filetype = null;

    // If there's a media file, upload it to Firebase
    if (mediafile) {
      const fileName = `${Date.now()}_${mediafile.originalname}`;
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: mediafile.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        blobStream.on("finish", () => {
          mediafilelink = `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
          }/o/${encodeURIComponent(fileName)}?alt=media`;
          filetype = path.extname(fileName);
          resolve();
        });
        blobStream.on("error", reject);
        blobStream.end(mediafile.buffer);
      });
    }

    const postDTO = new PostDTO(
      null,
      userid,
      caption,
      postingtime || new Date(),
      location,
      mediafilelink,
      filetype
    );

    const post = await postService.addPost(postDTO);

    res.status(200).json({ post, message: "Post created successfully!" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Controller function to get posts by a user
export const getPostsByUserHandler = async (req, res) => {
  try {
    const { userid } = req.params; // Get `userid` from the route parameter
    const { limit = 10, offset = 0 } = req.query; // Pagination parameters (optional)

    const postsByUser = await postService.getPostsByUser(userid, limit, offset);

    res.status(200).json({
      posts: postsByUser,
      message: `Posts retrieved for user: ${userid}`,
    });
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Controller function to delete a post by its ID
export const deletePostHandler = async (req, res) => {
  try {
    const { postid } = req.params; // Post ID from the route parameter

    const deletedPost = await postService.deletePost(postid);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ deletedPost, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getPostsForUsersHandler = async (req, res) => {
  try {
    const { currentUserId } = req.params;
    const { limit = 20, offset = 0 } = req.query; // Pagination parameters

    if (!currentUserId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch feed posts dynamically based on followers
    const feedPosts = await postService.getPostsForUsers(
      currentUserId,
      limit,
      offset
    );

    res.status(200).json({
      feedPosts,
      message: "Feed posts retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching feed posts:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

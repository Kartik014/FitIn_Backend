import posts from "../../database/models/posts/posts.js";

const postService = {
  // Add a new post
  addPost: async (postDTO) => {
    try {
      // Call the `addPost` function from the `posts` model
      const newPost = await posts.addPost(postDTO);
      return newPost;
    } catch (err) {
      console.error("Error in addPost service: ", err);
      throw err;
    }
  },

  // Get posts by a specific user
  getPostsByUser: async (userid, limit = 10, offset = 0) => {
    try {
      // Fetch posts of a specific user
      const userPosts = await posts.getPostsByUser(userid, limit, offset);
      return userPosts;
    } catch (err) {
      console.error("Error in getPostsByUser service: ", err);
      throw err;
    }
  },

  // Get posts for a list of users (e.g., for a user's feed)
  getPostsForUsers: async (currentUserId, limit = 20, offset = 0) => {
    try {
      // Fetch posts for a list of users
      const feedPosts = await posts.getPostsForUserFeed(
        currentUserId,
        limit,
        offset
      );
      return feedPosts;
    } catch (err) {
      console.error("Error in getPostsForUsers service: ", err);
      throw err;
    }
  },

  // Delete a post by its ID
  deletePost: async (postid) => {
    try {
      // Call the `deletePost` function from the `posts` model
      const deletedPost = await posts.deletePost(postid);
      return deletedPost;
    } catch (err) {
      console.error("Error in deletePost service: ", err);
      throw err;
    }
  },
};

export default postService;

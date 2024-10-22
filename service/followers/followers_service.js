import followers from "../../database/models/followers/followers.js";

const followerService = {
    addFollower: async (followersDTO) => {
        try {

            const followExist = await followers.getFollowRequest(followersDTO);
            if (followExist) {
                throw new Error('Follow request already exists');
            }

            const newFollowRequest = await followers.addFollower(followersDTO);
            return newFollowRequest;

        } catch (err) {

            console.error('Error in addFollower service: ', err);
            throw err;

        }
    },

    getFollowers: async (followersDTO) => {
        try {

            const followersList = await followers.getFollowers(followersDTO);
            return followersList;

        } catch (err) {

            console.error('Error in getFollowers service: ', err);
            throw err;

        }
    },

    getFollowing: async (followersDTO) => {
        try {

            const followingList = await followers.getFollowing(followersDTO);
            return followingList;

        } catch (err) {

            console.error('Error in getFollowing service: ', err);
            throw err;

        }
    },

    updateFollowRequest: async (followersDTO) => {
        try {

            const updatedFollowRequest = await followers.updateFollowRequest(followersDTO);
            return updatedFollowRequest;

        } catch (err) {

            console.error('Error in updateFolloRequest service: ', err);
            throw err;

        }
    },

    removeFollower: async (followersDTO) => {
        try {

            const followerRemoved = await followers.removeFollowers(followersDTO);
            return followerRemoved;

        } catch (err) {

            console.error('Error in removeFollower service: ', err);
            throw err;

        }
    }
}

export default followerService;
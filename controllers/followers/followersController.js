import { v4 as uuidv4 } from "uuid";
import FollowerDTO from "../../DTO/followersDTO.js";
import followerService from "../../service/followers/followers_service.js";
import { error } from "console";

const addFollowRequest = async (req, res) => {
    try {

        const { id, email, role } = req.user;

        const followID = uuidv4();

        const followersDTO = new FollowerDTO(
            followID,
            req.body.followerid,
            id,
            0
        )

        const newFollowRequest = await followerService.addFollower(followersDTO);

        res.status(200).json({
            message: 'Follow request sent successfully',
            followRequest: newFollowRequest
        });

    } catch (err) {

        console.error('Error in addFollowRequest controller: ', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

const getFollowers = async (req, res) => {
    try {

        const { id, email, role } = req.user;

        const followersDTO = new FollowerDTO(
            req.body.followID,
            id,
            null,
            req.body.requeststatus
        )

        const followersList = await followerService.getFollowers(followersDTO);

        res.status(200).json({
            message: 'Followers list retrieved successfully',
            followersList: followersList
        });

    } catch (err) {

        console.error('Error  in getFollowers controller: ', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

const getFollowing = async (req, res) => {
    try {

        const { id, email, role } = req.user;

        const followersDTO = new FollowerDTO(
            req.body.followID,
            null,
            id,
            req.body.requeststatus
        )

        const followingList = await followerService.getFollowing(followersDTO);

        res.status(200).json({
            message: 'Following list retrieved successfully',
            followingList: followingList
        });

    } catch (err) {

        console.error('Error in getFollowing controller: ', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

const updatedFollowRequest = async (req, res) => {
    try {

        const { id, email, role } = req.user;

        const followersDTO = new FollowerDTO(
            req.body.followID,
            null,
            null,
            req.body.requeststatus
        )

        const updateFollowRequest = await followerService.updateFollowRequest(followersDTO);
        res.status(200).json({
            message: 'Follow request updated successfully',
            updateFollowRequest: updateFollowRequest
        });

    } catch (err) {

        console.error('Error in updatedFollowRequest controller: ', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

const removeFollower = async (req, res) => {
    try {

        const { id, email, role } = req.user;

        const followersDTO = new FollowerDTO(
            req.body.followID,
            null,
            null,
            1
        )

        const removedFollower = await followerService.removeFollower(followersDTO);

        res.status(200).json({
            message: 'Follower removed successfully',
            removedFollower: removedFollower
        });

    } catch (err) {

        console.error('Error in removeFollower controller: ', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });

    }
}

export { addFollowRequest, getFollowers, getFollowing, updatedFollowRequest, removeFollower };
import express from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import xssClean from "xss-clean";
import { addFollowRequest, getFollowers, getFollowing, removeFollower, updatedFollowRequest } from "../controllers/followers/followersController.js";

const apiRouter = express.Router();

apiRouter
    .route("/addFollowRequest")
    .post(authenticateToken, xssClean(), addFollowRequest);

apiRouter
    .route("/getFollowers")
    .get(authenticateToken, xssClean(), getFollowers);

apiRouter
    .route("/getFollowing")
    .get(authenticateToken, xssClean(), getFollowing);

    apiRouter
    .route("/updateFollowRequest")
    .put(authenticateToken, xssClean(), updatedFollowRequest);

apiRouter
    .route("/removeFollower")
    .delete(authenticateToken, xssClean(), removeFollower);

export default apiRouter;
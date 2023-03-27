import express from 'express'
import {getFeedPosts, getUserPosts, likePost} from '../controllers/post.js'
import { verifyToken } from '../middleware/auth.js';

const postRouter = express.Router();

postRouter.get("/", verifyToken, getFeedPosts);
postRouter.get("/:userId/posts", verifyToken, getUserPosts);

/* liking is a patch operation, we are just updating the post with that specific id */
postRouter.patch("/:id/like", verifyToken, likePost);

export default postRouter;
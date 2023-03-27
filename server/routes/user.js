import express from 'express'
import User from '../models/User.js'
import { verifyToken } from '../middleware/auth.js';
import {
    getUser,
    getUserFriends,
    addRemoveFriend
} from '../controllers/user.js'

const userRouter = express.Router();

userRouter.get("/:id", verifyToken, getUser)
userRouter.get("/:id/friends", verifyToken, getUserFriends)

/* this is going to be the update route */
userRouter.patch("/:id/:friendId", verifyToken, addRemoveFriend)


export default userRouter;
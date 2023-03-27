import express from 'express'
import mongoose from 'mongoose'
import helmet, { crossOriginResourcePolicy } from 'helmet'
import morgan from 'morgan'
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer';
import { register } from './controllers/auth.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import postRouter from './routes/post.js';
import { verifyToken } from './middleware/auth.js';
import {createPost} from './controllers/post.js'
import User from './models/User.js';
import Post from './models/Post.js';

import { users, posts } from './data/index.js';

/* let's do the configuration here*/
const filename = fileURLToPath(import.meta.url) 
const dirname = path.dirname(filename);
dotenv.config()

const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan('combined'))
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit:"30mb", extended: true}))
app.use(cors())
app.use("/assets", express.static(path.join(dirname, 'public/assets')))


/* now let's set up the file storages */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/assets')
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname); // use the original file name
    }
})

const upload = multer({storage});


/* let's do the authorization logic here */
app.post("/auth/register", upload.single("picture"), register)
app.post("/post", upload.single("picture", verifyToken, createPost))

/* now let's create a router for all our routes */
app.use("/post", postRouter)
app.use("/auth", authRouter)
app.use("/user", userRouter)


/* MONGOOSE setup */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    app.listen(PORT, ()=> console.log(`servor running at ${PORT}`))
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error) => console.log(`${error} did not connect`))

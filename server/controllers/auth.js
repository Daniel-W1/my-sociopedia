import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import  User  from '../models/User.js';

/* has to be async because we are calling the mongodb, which takes time and which is asyncronous func */
export const register = async (req, res) =>{

    try {
        
        const {
            firstName, 
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;
    
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email, 
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedPofile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000)
        })

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

export const login = async (req, res) =>{

    try {
        
        // get the email and the password
        const {email, password}  = req.body;
    
        const user = await User.findOne({email});
    
        if (!user) {
            res.status(400).json({message: "The Password or the Email is Incorrect"});
        }
    
        const passwordCheck = bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            res.status(400).json({message: "The Password or the Email is Incorrect"});
        }
    
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        delete user.password; // this will prevent the password from being sent back to the front end

        res.status(200).json({token, user});

    } catch (error) {
        
    }




}
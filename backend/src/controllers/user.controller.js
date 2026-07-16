import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt, { hash } from "bcrypt"
import crypto from "crypto"
import { Meeting } from "../models/meeting.model.js";
import {
    findUserByToken,
    findUserByUsername,
    invalidateUserCache,
} from "../services/userCache.service.js";

const login = async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Please provide username & password"
        });
    }

    try {
        // Find single user
        const user = await findUserByUsername(username);

        if (!user) {
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: "User not found" });
        }

        // Compare password
        let isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");

            const previousToken = user.token;
            user.token = token;
            await user.save();
            await invalidateUserCache(user.username, previousToken);

            return res.status(httpStatus.OK).json({ token: token })
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid Username or Password"
            })
        }
        

    } catch (e) {
        return res.status(500).json({
            message: `Something went wrong ${e}`  
        });
    }
}

const register = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10)//Plain password → Salt added → Hashed

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        })

        await newUser.save();

        res.status(httpStatus.CREATED).json({ message: "User registered" });

    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }

}

const getUserHistory = async (req , res)=>{
    const {token} = req.query ;

    try{
        const user = await findUserByToken(token)
        const meetings = await Meeting.find({ user_id: user.username })
        res.json(meetings)
    }catch(e){
         res.json({ message: `Something went wrong ${e}` })
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await findUserByToken(token);

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

export { login, register , getUserHistory, addToHistory }
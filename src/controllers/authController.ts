import { Request, Response} from 'express';
import bcrypt from 'bcrypt'; // Used to hash password while saving or retrieving it in responses
import jwt from 'jsonwebtoken';
import userService from '../services/userService';
import User from '../schemas/userSchema';
import EmailVerification from "../schemas/emailVerificationSchema";
import { userCreationSchema, loginSchema } from "../schemas/authSchema";
import { sendVerificationCodeEmail } from '../utils/emailVerification';

import COOKIE_OPTIONS from '../utils/cookieOptions';

//Enable enviroment variables
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET as string;



export const registerUser = async (req: Request, res: Response) => {
    try {
        const data = userCreationSchema.parse(req.body);

        //If user already exists...
        const existingUser = await userService.findByEmail(data.email);

        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const createdUser = await User.create({
            username: data.username,
            email: data.email,
            password: hashedPassword
        });
        console.log("User created!");

        // Generate and sent JWT via cookie
        const token = jwt.sign({ userId: createdUser._id }, JWT_SECRET, { expiresIn: '15m' });
        res.cookie("token", token, COOKIE_OPTIONS);
        console.log("Token generated");

        console.log("Cookie with JWT set successfully");

        // Send verification code via email after successful user registration
        sendVerificationCodeEmail({email:data.email});

        const userDTO = {
            id: createdUser._id,
            username: createdUser.username,
            email: createdUser.email
        };

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: userDTO,
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: process.env.NODE_ENV === 'development' ? error : null });
    }
};


export const loginUser = async (req: Request, res: Response) => {
    
    try {
        const { input, password } = loginSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Request body", {input, hashedPassword});

        // Find user by email or username
        let user;
        if (/\S+@\S+\.\S+/.test(input)) {
            user = await userService.findByEmail(input);
        } else {
            user = await userService.findByUsername(input);
        }
        
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Check password
        if (!(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: 'Invalid credentials' });
        }

        // User DTO for response (without exposing delicate data)
        const userDTO = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        // Generate JWT
        const token = jwt.sign({ userId: user._id}, JWT_SECRET, { expiresIn: '15m' });
        res.cookie("token", token, COOKIE_OPTIONS);
        console.log("User was successfully authenticated using JWT");
        res.status(200).json({ 
            message: 'Login successful', 
            token: token,
            user: userDTO
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: true });
    res.status(200).json({ message: "Logged out successfully!" });
};

interface JwtPayloadWithUser extends jwt.JwtPayload {
    userId: string;
}  

// POST: Check for authenticated user
export const authCheck = async (req: Request, res: Response) => {
    
    const token = req.cookies.token; 
    
    if (!token) { 
        console.log("No authenticated!"); 
        res.status(401).json({ message: 'No autenticathed' });
        return; 
    };

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUser;
        const user = await User.findById(decoded.userId).select("id username email");

        if (!user){
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'Authenticated', user: user });
        return;
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};

// POST: Email verification
export const verifyEmail = async (req:Request, res:Response) => {
    // Get request cookies token
    const token = req.cookies.token;
    if (!token) {
        console.log("User is not authenticated");
        res.status(401).json({ message: "No authenticated" });
        return;
    }

    try {
        // User auth check
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUser;
        const user = await User.findById(decoded.userId).select("id username email");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            console.log("User not found");
            return;
        }

        // Data
        const userEmail = user.email;
        const { code } = req.body;
        if (!userEmail || !code) { 
            console.log("Missing data (code)");
            res.status(400).json({ message: "Missing data" });
            return;
        }

        // Code verification
        const verificationCode = await EmailVerification.find({email:userEmail, code:code});
        if (!verificationCode) {
            console.log("Verification code not found/invalid");
            res.status(400).json({ message: "Invalid code" });
            return;
        }

        // Update user
        await User.updateOne({ _id: user._id }, {isEmailVerified:true});
        console.log("Updated user (isEmailVerified:true)");

        // Delete verification code
        await EmailVerification.deleteOne({ email: userEmail });

        console.log("Email verified successfully");
        res.status(200).json({ message: "Email verified successfully" });
        return;
    } catch (error) {
        console.log("Failed to verify email", error);
        res.status(401).json({ message: "Unexpected error", error: error });
        return;
    }
};
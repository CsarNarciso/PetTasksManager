import { Request, Response} from 'express';
import bcrypt from 'bcrypt'; // Used to hash password while saving or retrieving it in responses
import jwt from 'jsonwebtoken';
import userService from '../services/userService';
import User from '../schemas/userSchema';
import { userCreationSchema, loginSchema } from "../schemas/authSchema";
import { z } from 'zod';

import COOKIE_OPTIONS from '../utils/cookieOptions';

//Enable enviroment variables
require('dotenv').config();



interface JwtPayloadWithUser extends jwt.JwtPayload {
    userId: string;
}  

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN as any;
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN as any;


export const registerUser = async (req: Request, res: Response) => {
    try {
        const data = userCreationSchema.parse(req.body);

        //If user already exists...
        const existingUser = await userService.findByEmail(data.email);

        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        //Create new user
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const createdUser = await User.create({
            username: data.username,
            email: data.email,
            password: hashedPassword
        });

        // Generate refresh token in cookie
        const refreshToken = jwt.sign({ userId: createdUser._id }, REFRESH_SECRET, {expiresIn: REFRESH_EXPIRES_IN});
        res.cookie("refresh", refreshToken, COOKIE_OPTIONS);

        //Generate access token
        const token = jwt.sign({ userId: createdUser._id }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });

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
            return;
        }

        // User DTO for response (without exposing delicate data)
        const userDTO = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        //Generate refresh token (in cookie)
        const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
        res.cookie("refresh", refreshToken, COOKIE_OPTIONS);

        // Generate access token
        const token = jwt.sign({ userId: user._id}, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
        
        console.log("User was successfully authenticated");
        
        res.status(200).json({ 
            message: 'Successfully authenticated', 
            user: userDTO,
            token: token
        });
        return;
        
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
        return;
    }
};



export const refresh = async (req: Request, res: Response) => {

    const refreshToken = req.cookies?.refresh;
    
    if(!refreshToken) {
        res.status(401).json({message: "missing token"});
        return;
    }

    try {
        
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as JwtPayloadWithUser;
        const foundUser = await User.findOne(decoded._id).select("id");

        if(!foundUser) {
            res.status(401).json({message: "user not found"});
            return;
        }

        //Generate new access token
        const newAccessToken = jwt.sign({ userId: foundUser.id }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
        res.status(200).json({token: newAccessToken});
        return;

    } catch (err) {
        res.status(401).json({message: "invalid token"});
        return;
    }
};



export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie("refresh", { httpOnly: true, sameSite: "strict", secure: true });
    res.status(200).json({ message: "Logged out successfully!" });
};




export const authCheck = async (req: Request, res: Response) => {
    
    const accessToken = req.headers.authorization;
    
    if (!accessToken) { 
        res.status(401); //missing token, but for security reasons dont give details!
        return; 
    };

    try {
        const decoded = jwt.verify(accessToken, ACCESS_SECRET) as JwtPayloadWithUser;
        const user = await User.findById(decoded.userId).select("id username email");

        if (!user){
            res.status(401); //user not found
            return;
        }

        res.status(200).json({ message: 'Authenticated', user });
        return;

    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};
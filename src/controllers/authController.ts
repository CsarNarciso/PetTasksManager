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

        //Create new user
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

export const authCheck = async (req: Request, res: Response) => {
    
    const token = req.cookies.token; 
    
    if (!token) res.status(401).json({ message: 'No autenticado' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUser;
        const user = await User.findById(decoded.userId).select("username email");

        if (!user) res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'Authenticated', user: user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

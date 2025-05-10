import { Request, Response} from 'express';
import bcrypt from 'bcrypt'; // Used to hash password while saving or retrieving it in responses
import jwt from 'jsonwebtoken';
import userService from '../services/userService';
import { z } from 'zod';
import User from '../schemas/userSchema';

//Enable enviroment variables
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET as string;



// Schema for validation in runtime for login
const loginSchema = z.object({
    input: z.union([z.string(), z.string().email()]),
    password: z.string().min(8),
});
// Schema for user creation validation in runtime
const userCreationSchema = z.object({
    username: z.string(),
    email: z.string().email(), // To check for a valid email
    password: z.string().min(8), // To check password is at least 8 characters lenght
});




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
        const authToken = jwt.sign({ userId: createdUser._id }, JWT_SECRET, { expiresIn: '1h' });
        console.log("Token generated");

        res.cookie("authToken", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS is only available in production, in development it uses HTTP
            sameSite: "strict", // CSRF protection
            path: "/", // Available in the entire app
            maxAge: 3600000 // 1 hour in miliseconds
        });

        console.log("Cookie with JWT set successfully");

        const userDTO = {
            id: createdUser._id,
            username: createdUser.username,
            email: createdUser.email
        };

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: userDTO,
            token: authToken
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

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        console.log("User was successfully authenticated using JWT");
        res.status(200).json({ message: 'Login successful', token });
        
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: true });
    res.status(200).json({ message: "Logged out successfully!" });
};

import { Request, Response} from 'express';
import bcrypt from 'bcrypt'; // Used to hash password while saving or retrieving it in responses
import jwt from 'jsonwebtoken';
import userService from '../services/userService';
import { z } from 'zod';

const SECRET = process.env.JWT_SECRET || '2c6f24d4e71008765083e2d96e1ccf3d133d51814396a6d8f11a2d87b15ac34c1c38980b67d505642c0d7744b16a17be31e93c6caad5f874f375c5b86789079b';

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
        const createdUser = await userService.create(data);

        // Generate JWT
        const token = jwt.sign({ userId: createdUser._id }, SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token });

    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error });
    }
};


export const loginUser = async (req: Request, res: Response) => {
    
    try {
        const { input, password } = loginSchema.parse(req.body);

        // Find user by email or username
        let user = "";
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
        const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
        
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};
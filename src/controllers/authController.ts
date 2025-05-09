import { Request, Response} from 'express';
import bcrypt from 'bcrypt'; // Used to hash password while saving or retrieving it in responses
import jwt from 'jsonwebtoken';
import userService from '../services/userService';
import { z } from 'zod';
import User from '../schemas/userSchema';

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


// Endpoints
export const registerUser = async (req: Request, res: Response) => {
    try {
        const data = userCreationSchema.parse(req.body);
        console.log("Request body:", req.body);

        //If user already exists...
        const [existingEmail, existingUsername] = await Promise.all([
            userService.findByEmail(data.email),
            userService.findByUsername(data.username)
        ]);

        if (existingEmail) {
            res.status(400).json({ message: 'Email already in use' });
        }
        if (existingUsername) {
            res.status(400).json({ message: 'Username already taken' });
        }

        //Create new user
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const createdUser = await User.create({
            username: data.username,
            email: data.email,
            password: hashedPassword
        });

        // Generate and sent JWT via cookie
        const token = jwt.sign({ userId: createdUser._id }, SECRET, { expiresIn: '1h' });
        console.log("Token generated");

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS is only available in production, in development it uses HTTP
            sameSite: "strict", // CSRF protection
            path: "/", // Available in the entire app
            maxAge: 3600000 // 1 hour in miliseconds
        });

        console.log("Cookie with JWT set successfully");

        res.status(201).json({ 
            message: 'User registered successfully',
            user: { id: createdUser._id, username: createdUser.username },
            accessToken: token
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }
        res.status(500).json({ 
            message: 'Registration failed', 
            error: process.env.NODE_ENV === 'development' ? error : null 
        });
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
        const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
        
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: true });
    res.status(200).json({ message: "Logged out successfully!" });
};

export const verifyUserSession = (req: Request, res: Response) => {
    const token = req.cookies.authToken;

    if (!token) {
        res.status(401).json({ 
            authenticated: false, 
            message: "No authentication token found" 
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        res.status(200).json({ authenticated: true, user: {userId: decoded} }); //User's info
    } catch (error) {
        let errorMessage = 'Invalid token';
        if (error instanceof jwt.TokenExpiredError) {
            errorMessage = 'Token expired';
        }

        res.status(401).json({ 
            authenticated: false,
            message: errorMessage
        });
    }
};

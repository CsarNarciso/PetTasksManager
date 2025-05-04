import { Request, Response } from 'express';
import bcrypt from 'bcrypt'; // Used to hash password while saving or retrieving it in responses
import jwt from 'jsonwebtoken';
import userService from '../services/userService';

const SECRET = process.env.JWT_SECRET || '2c6f24d4e71008765083e2d96e1ccf3d133d51814396a6d8f11a2d87b15ac34c1c38980b67d505642c0d7744b16a17be31e93c6caad5f874f375c5b86789079b';

export const registerUser = async (req: Request, res: Response) => {
    try {

        //If user already exists...
        if (userService.findByEmail(req.body.email) != null) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //Create new user
        const createdUser = await userService.create(req.body);

        // Generate JWT
        const token = jwt.sign({ userId: createdUser._id }, SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token });
        
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await userService.findByEmail(email);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        if (!bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
        
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};
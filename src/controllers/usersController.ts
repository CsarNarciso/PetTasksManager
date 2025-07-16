import { Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userSchema from '../schemas/userSchema';
import User from "../schemas/userSchema";

require('dotenv').config();
// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const JWT_SECRET = process.env.JWT_SECRET as string;


export const deleteAccount = async (req: Request, res: Response) => {
    const { username } = req.body;

    try {
        await User.findOneAndDelete({ username });
        res.clearCookie('token');
        res.status(200).json({ message: "Account was successfully deleted" });

    } catch (err) {
        res.status(401).json({ error: `Authentication error: ${err}` });
    }
};


export const fetchAuthUserData = async (req: Request, res: Response) => {
    const token = req.cookies.token; 
    console.log(`Token: ${token}`);
    
    if (!token) res.status(401).json({ message: 'Not authenticated' });

    try {
        const user = jwt.verify(token, JWT_SECRET);
        console.log("User data:", user);
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(401).json({ message: 'Unexpected error' });
    }
}

export const fetchUserByUsername = async (req: Request, res: Response) => {
    
    try {
        const { username } = req.query;
        
        // Fetch user
        const user = await userSchema.findOne({username:username}); 

        if (!user) {
            res.status(404).json({ message: "Not user found" });
            return;
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export const listUsers = async (req: Request, res: Response) => {
    
    try {
        // Fetch user
        const usersJSON = await userSchema.find(); 
        
        if (!usersJSON) {
            res.status(404).json({ message: 'Not users found' });
            return;
        }

        res.status(200).json({ usersJSON });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export const createUser = async (req: Request, res: Response) => {
    
    try {
        const data = req.body;
        
        // Fetch user
        const newUser = await userSchema.create({username:data.username, email:data.email, password:await bcrypt.hash(data.password, 10), age:data.age, gender:data.gender, tier:data.tier}); 

        if (!newUser) {
            res.status(400).json({ message: "Bad request" });
            return;
        }
        res.status(201).json({ newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error'});
    }
};
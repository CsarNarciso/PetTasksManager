import { Request, Response} from 'express';
import bcrypt from 'bcrypt';
import userSchema from '../schemas/userSchema';

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
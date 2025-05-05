import { Request, Response} from 'express';
import connectDB from '../utils/database';
import userSchema from '../schemas/userSchema';

export const fetchUserByUsername = async (req: Request, res: Response) => {
    
    try {

        const username = req.query;

        // Connect to DB
        await connectDB();
        
        // Fetch user
        const user = await userSchema.findOne({username}); 

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
        // Connect to DB
        await connectDB();
        
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


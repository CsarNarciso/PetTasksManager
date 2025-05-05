import { Request, Response} from 'express';
import connectDB from '../utils/database';

export const fetchUserByUsername = async (req: Request, res: Response) => {
    
    try {

        const username = req.query;

        // Connect to DB
        const db = await connectDB();
        // Use users collection
        const usersCollection = db.collection('users');
        
        // Fetch user
        const user = await usersCollection.findOne({username}); 

        if (!user) {
            return res.status(404).json({ message: "Not found user" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export const listUsersyou = async (req: Request, res: Response) => {
    
    try {
        // Connect to DB and use collection
        const db = await connectDB();
        const usersCollection = db.collection('users');

        // Fetch users
        const users = await usersCollection.find();
        
        if (!users) {
            res.status(404).json({ message: 'Not found users' });
            return;
        }

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


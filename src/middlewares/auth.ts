import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User from '../schemas/userSchema';

//Enable enviroment variables
require('dotenv').config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const TOKEN_EXPIRED_ERROR = process.env.TOKEN_EXPIRED_ERROR as string;

interface JwtPayloadWithUser extends jwt.JwtPayload {
    userId: string;
}  



const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    // Get request cookies token
    const token = req.cookies.token;
    
    if (!token) {
        res.status(401).json({ message: "Missing token" });
        return;
    }

    try {

        const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayloadWithUser;
        const foundUser = await User.findById(decoded.userId).select("id username email isEmailVerified");

        if (!foundUser){
            res.status(401).json({ message: 'User not found' });
            return;
        }

        req.user = foundUser;
        next();

    } catch (err) {

        if(err instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: "Expired token", error: TOKEN_EXPIRED_ERROR });
            return;    
        }
        res.status(401).json({ message: "Invalid token" });
        return;
    }
};

export default authenticate;
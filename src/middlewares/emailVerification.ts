import { Request, Response, NextFunction } from "express";

const UNVERIFIED_EMAIL_ERROR_CODE = "UNVERIFIED_EMAIL";

// POST: Check for authenticated user
const emailVerification = (req: Request, res: Response, next: NextFunction) => {
  
    //Get user
    const user = req.user;

    if(!user.isEmailVerified) {
        console.log("aaaaaaaa");
        res.status(401).json({ message: "Email is not verified", error: UNVERIFIED_EMAIL_ERROR_CODE });
        return;
    }
    next();
};

export default emailVerification;
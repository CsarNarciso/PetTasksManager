import nodemailer from "nodemailer";
import { connectDB } from "./database";
import { ObjectId, Promise } from "mongoose";
import emailVerificationSchema from "../schemas/emailVerificationSchema";


// Types
interface EmailVerificationProps {
    userEmail: string;
}

// Send email verification code to email
export const sendVerificationCodeEmail = async ({userEmail}:EmailVerificationProps) => {
    // Connect to db
    await connectDB()  

    // Generate email verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  
    // Save email verification code to database
    await emailVerificationSchema.create({
        userEmail,
        code
    })
  
    // Set SMTP protocol service(transporter) for email sending
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: "Your Verification Code",
      text: `Use this code to verify your email: ${code}\nGo back to the website on http://localhost:3000/auth/emailverification and enter the verification code to continue.`,
    });
};
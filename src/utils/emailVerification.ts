import nodemailer from "nodemailer";
import emailVerificationSchema from "../schemas/emailVerificationSchema";

// Enable enviroment variables
require('dotenv').config();

// Types
interface EmailVerificationProps {
    email: string;
}

// Send email verification code to email
export const sendVerificationCodeEmail = async ({email}:EmailVerificationProps) => {

    // Generate email verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  
    // Save email verification code to database
    await emailVerificationSchema.create({
        email,
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
  
    // Send email with verification code to the user
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Use this code to verify your email: ${code}\nGo back to the website on http://localhost:3000/auth/emailverification and enter the verification code to continue.`,
    });
};
import { Schema, model } from "mongoose";

const emailVerificationSchema = new Schema({
    email: { 
        type: String, 
        required: true 
    },
    code: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 600} // Delete email verification code after 10 minutes
})

export default model('EmailVerification', emailVerificationSchema);
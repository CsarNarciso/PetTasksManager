import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: { type:String, 
        required:true, 
        unique:true 
    },
    email: { type:String, 
        required:true, 
        unique:true 
    },
    password: { 
        type:String, 
        required:true 
    }, // Hashed before storing
    age: { 
        type:Number, 
        required:false, 
        default:18
    },
    gender: { 
        type:String, 
        required:false,
        enum: ["Male", "Female", "Non-binary", "I prefer not to say"], 
        default:"I prefer not to say"
    },
    tier: { 
        type:String, 
        required:true, 
        enum: ["Free", "Basic", "Pro"], 
        default:"Free"
    },    
    isEmailVerified: {
        type:Boolean,
        required:true,
        default:false
    },
    createdAt: { type:Date, default:Date.now }
});

export default model('User', userSchema);
import mongoose, { Schema, model } from 'mongoose';

const taskSchema = new Schema({

    name: { 
		
		type:String, 
        required:true, 
        unique:true
    },
	isCompleted: { 

		type:Boolean, 
		default:false
    },
    type: {
        type: String
    },
    timeToResetInSeconds: {
        type: Number,
        default: 60*60*24
    },
    completedAt: {
        type: Date
    },
    showAt: {
        type: Date
    },
    userId: {
        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

export default model('Task', taskSchema);
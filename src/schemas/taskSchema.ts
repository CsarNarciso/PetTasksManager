import { Schema, model } from 'mongoose';

const taskSchema = new Schema({

    name: { 
		
		type:String, 
        required:true, 
        unique:true 
    },
	isComplete: { 
		
		type:Boolean, 
		default:false
    }
});

export default model('Task', taskSchema);
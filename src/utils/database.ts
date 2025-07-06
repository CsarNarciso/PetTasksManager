import mongoose from 'mongoose';
import userSchema from '../schemas/userSchema';
import taskSchema from '../schemas/taskSchema';
import bcrypt from 'bcrypt';

// Get mongodb from .env file or specified explicity
const dbHost = 'localhost';
const dbPort = '27017'; // 27017: Default MongoDB port
const dbName = 'PetTasksManagerDB';
const MONGO_URI = process.env.MONGO_URI || `mongodb://${dbHost}:${dbPort}/${dbName}`;

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully!');
        return connection;
    } catch (error) {
        console.error('Connection to MongoDB was refused:', error);
        process.exit(1);
    }
}


export const cleanDB = async () => {
    try {

        //Drop entire DB
        await mongoose.connection.dropDatabase();
        console.log('Database erased');

    } catch (error) {
        console.error('Something went wrong while dropping database');
        process.exit(1);
    }
}

export const preLoadUserDBData = async () => {
    try {
        
        //Load test user
        const username = 'user';
        const password = 'password';
        const isEmailVerified = true;

        const user = await userSchema.create(
            {
                username, 
                email:`${username}@gmail.com`, 
                password: await bcrypt.hash(password, 10), 
                isEmailVerified: isEmailVerified
            }); 
        console.log(`Test user pre-loaded on DB: '${username}' with password '${password}'`);

    } catch (error) {
        console.error(`Error while preloading user data on DB: ${error}`);
        process.exit(1);
    }
} 

// Delay async func execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const preLoadTasksDBData = async () => {
    await delay(3000);

    try {
        // Get default user
        const defaultUser = await userSchema.findOne({"username":"user"})

        if (!defaultUser) {
            console.error("Default user not found.");
            return;
        }

        // Create preload tasks

        // Task to show today (or that have to been showed since yesterday)

        const today = new Date();
        const tomorrow = today.setDate(today.getDate() + 1);
        const yesterday = today.setDate(today.getDate() - 1);

        await taskSchema.create({
            name:"Task 1", 
            isCompleted:false, 
            userId:defaultUser._id,
            showAt: today
        });

        await taskSchema.create({
            name:"Task 2", 
            isCompleted:false, 
            userId:defaultUser._id,
            showAt: yesterday
        });

        // Task to show tomorrow

        await taskSchema.create({
            name:"Task 3", 
            isCompleted:true, 
            userId:defaultUser._id,
            showAt: tomorrow
        });

        await taskSchema.create({
            name:"Task 4", 
            isCompleted:true, 
            userId:defaultUser._id,
            showAt: tomorrow
        });

        console.log("Preload tasks were created");

    } catch (error) {
        console.error("Error while preloading tasks on DB");
        process.exit(1);
    }
} 
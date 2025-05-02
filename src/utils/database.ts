import mongoose from 'mongoose';

// Get mongodb from .env file or specified explicity
const dbHost = 'localhost';
const dbPort = '27017'; // 27017: Default MongoDB port
const dbName = 'PetTasksManagerDB';
const MONGO_URI = process.env.MONGO_URI || `mongodb://${dbHost}:${dbPort}/${dbName}`;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('Connection to MongoDB was refused:', error);
        process.exit(1);
    }
}

export default connectDB;
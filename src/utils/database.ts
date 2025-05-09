import mongoose from 'mongoose';

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
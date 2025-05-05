
import express, { Request, Response } from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter';
import usersRouter from './routes/usersRouter';
import connectDB from './utils/database';

// API settings
const app = express();
const apiRouter = express.Router();
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use('/api', apiRouter); 

// Connect to DB
connectDB();

// Base Endpoints 
apiRouter.get('/hello', (req: Request, res: Response) => {
    res.json({ message: 'Admin is online 😈' });
});

// Routes
app.use('/auth', authRouter); 
app.use('/users', usersRouter);

// Run server 
app.listen(5000, () => {
    console.log('🔥 Server running on port 5000');
  });


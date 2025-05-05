
import express, { Request, Response } from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter';
import usersRouter from './routes/usersRouter';

const app = express();
const apiRouter = express.Router();
app.use(cors({
  origin: 'http://localhost:3000' // Only allow React frontend to have access to this API
}));
app.use(express.json()); // Middleware to read JSON in body
app.use('/api', apiRouter); // Base API router

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


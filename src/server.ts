import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { z } from 'zod';

const app = express();
const apiRouter = express.Router();
app.use(cors({
  origin: 'http://localhost:3000' // Only allow React frontend to have access to this API
}));
app.use(express.json()); // Middleware to read JSON in body
app.use('/api', apiRouter); // Base API router


// ################## Endpoints ################## //
apiRouter.get('/hello', (req: Request, res: Response) => {
    res.json({ message: 'Admin is online 😈' });
});


// ################## Run server ################## //
app.listen(5000, () => {
    console.log('Server running on port 5000');
  });
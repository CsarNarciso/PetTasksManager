import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

export default authRouter;

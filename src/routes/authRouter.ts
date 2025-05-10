import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController';
const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);

export default authRouter;

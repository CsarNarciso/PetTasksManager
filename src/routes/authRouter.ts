import { Router } from 'express';
import { registerUser, loginUser, logoutUser, authCheck, verifyEmail } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.get('/check', authCheck);
authRouter.post('/verifyEmail', verifyEmail);

export default authRouter;

import { Router } from 'express';
import { registerUser, loginUser, logoutUser, authCheck } from '../controllers/authController';
const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.get('/check', authCheck);

export default authRouter;

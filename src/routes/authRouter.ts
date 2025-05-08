import { Router } from 'express';
import { registerUser, loginUser, logoutUser, verifyUserSession } from '../controllers/authController';
const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.get('/verify', verifyUserSession);

export default authRouter;

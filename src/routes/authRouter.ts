import { Router } from 'express';
import { registerUser, loginUser, refresh, logoutUser, authCheck, verifyEmail, sendEmailVerificationCode, checkIsEmailVerified } from '../controllers/authController';
import authenticate from '../middlewares/auth';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logoutUser);
authRouter.get('/check', authenticate, authCheck);
authRouter.post('/verifyEmail', authenticate, verifyEmail);
authRouter.post('/sendEmailVerificationCode', authenticate, sendEmailVerificationCode);
authRouter.post('/checkIsEmailVerified', authenticate, checkIsEmailVerified);

export default authRouter;

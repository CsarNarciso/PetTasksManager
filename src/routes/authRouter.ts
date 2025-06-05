import { Router } from 'express';
import { registerUser, loginUser, refresh, logoutUser, authCheck, verifyEmail, sendEmailVerificationCode, checkIsEmailVerified } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logoutUser);
authRouter.get('/check', authCheck);
authRouter.post('/verifyEmail', verifyEmail);
authRouter.post('/sendEmailVerificationCode', sendEmailVerificationCode);
authRouter.post('/checkIsEmailVerified', checkIsEmailVerified);

export default authRouter;

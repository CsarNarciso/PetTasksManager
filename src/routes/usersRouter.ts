import { Router } from 'express';
import { listUsers, fetchUserByUsername, createUser, fetchAuthUserData, deleteAccount } from '../controllers/usersController';
import authenticate from '../middlewares/auth';

const usersRouter = Router();

// Add globally auth middleware for this router
usersRouter.use(authenticate);

usersRouter.get('/', listUsers);
usersRouter.get('/search', fetchUserByUsername);
usersRouter.post('/', createUser);
usersRouter.get('/authuserdata', fetchAuthUserData);
usersRouter.post('/deleteAccount', deleteAccount);

export default usersRouter;

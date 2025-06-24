import { Router } from 'express';
import { listUsers, fetchUserByUsername, createUser, fetchAuthUserData } from '../controllers/usersController';
import authetnicate from '../middlewares/auth';

const usersRouter = Router();

// Add globally auth middleware for this router
usersRouter.use(authetnicate);

usersRouter.get('/', listUsers);
usersRouter.get('/search', fetchUserByUsername);
usersRouter.post('/', createUser);
usersRouter.get('/authuserdata', fetchAuthUserData);

export default usersRouter;

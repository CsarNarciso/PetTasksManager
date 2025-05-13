import { Router } from 'express';
import { listUsers, fetchUserByUsername, createUser, fetchAuthUserData } from '../controllers/usersController';
const usersRouter = Router();

usersRouter.get('/', listUsers);
usersRouter.get('/search', fetchUserByUsername);
usersRouter.post('/', createUser);
usersRouter.get('/authuserdata', fetchAuthUserData);

export default usersRouter;

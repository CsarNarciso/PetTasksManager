import { Router } from 'express';
import { listUsers, fetchUserByUsername, createUser } from '../controllers/usersController';
const usersRouter = Router();

usersRouter.get('/', listUsers);
usersRouter.get('/search', fetchUserByUsername);
usersRouter.post('/', createUser);

export default usersRouter;

import { Router } from 'express';
import { listUsers, fetchUserByUsername } from '../controllers/usersController';
const usersRouter = Router();

usersRouter.get('/users', listUsers);
usersRouter.get('/users', fetchUserByUsername);

export default usersRouter;

import { Router } from 'express';
import { listUsers, fetchUserByUsername } from '../controllers/usersController';
const usersRouter = Router();

usersRouter.get('/', listUsers);
usersRouter.get('/', fetchUserByUsername);

export default usersRouter;

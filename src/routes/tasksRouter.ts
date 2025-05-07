import { Router } from 'express';
import { createTask, setTaskAsCompleted, deleteTask, listTasksByUsername } from '../controllers/tasksController';

const tasksRouter = Router();

tasksRouter.post('/', createTask);
tasksRouter.patch('/', setTaskAsCompleted);
tasksRouter.delete('/', deleteTask);
tasksRouter.get('/', listTasksByUsername);

export default tasksRouter;

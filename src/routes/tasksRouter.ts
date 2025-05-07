import { Router } from 'express';
import { createTask, markTaskAsCompleted, deleteTask, listTasksByUsername } from '../controllers/tasksController';
const tasksRouter = Router();

tasksRouter.post('/', createTask);
tasksRouter.put('/', markTaskAsCompleted);
tasksRouter.delete('/', deleteTask);
tasksRouter.get('/', listTasksByUsername);

export default tasksRouter;

import { Router } from 'express';
import { createTask, markTaskAsCompleted, deleteTask, listTasksByUsername } from '../controllers/tasksController';

const tasksRouter = Router();

tasksRouter.post('/', createTask);
tasksRouter.patch('/:taskId', markTaskAsCompleted);
tasksRouter.delete('/', deleteTask);
tasksRouter.get('/', listTasksByUsername);

export default tasksRouter;

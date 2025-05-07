import { Router } from 'express';
import { createTask, setTaskAsCompleted, deleteTask, listTasksByUserId, listAllTasks } from '../controllers/tasksController';

const tasksRouter = Router();

tasksRouter.post('/', createTask);
tasksRouter.patch('/', setTaskAsCompleted);
tasksRouter.delete('/', deleteTask);
tasksRouter.get('/search', listTasksByUserId);
tasksRouter.get('/', listAllTasks);

export default tasksRouter;

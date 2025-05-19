import { Router } from 'express';
import { createTask, setTaskAsCompleted, deleteTask, fetchTasksByUserId, listAllTasks } from '../controllers/tasksController';

const tasksRouter = Router();

tasksRouter.post('/', createTask);
tasksRouter.patch('/', setTaskAsCompleted);
tasksRouter.delete('/', deleteTask);
tasksRouter.get('/search', fetchTasksByUserId);
tasksRouter.get('/', listAllTasks);

export default tasksRouter;

import { Router } from 'express';
import { createTask, setTaskAsCompleted, deleteTask, fetchTasksByUserId, listAllTasks } from '../controllers/tasksController';
import authetnicate from '../middlewares/auth';

const tasksRouter = Router();

// Add globally auth middleware for this router
tasksRouter.use(authetnicate);

tasksRouter.post('/', createTask);
tasksRouter.patch('/', setTaskAsCompleted);
tasksRouter.delete('/', deleteTask);
tasksRouter.get('/search', fetchTasksByUserId);
tasksRouter.get('/', listAllTasks);

export default tasksRouter;

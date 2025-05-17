import { Router } from 'express';
import { createTask, setTaskAsCompleted, deleteTask, fetchUncompletedTasksByUserId, listAllTasks } from '../controllers/tasksController';

const tasksRouter = Router();

tasksRouter.post('/', createTask);
tasksRouter.patch('/', setTaskAsCompleted);
tasksRouter.delete('/', deleteTask);
tasksRouter.get('/search', fetchUncompletedTasksByUserId);
tasksRouter.get('/', listAllTasks);

export default tasksRouter;

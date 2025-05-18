import { Router } from 'express';
import { createTask, setTaskAsCompleted, deleteTask, fetchTasksByUserId, listAllTasks, getCompletedTasksCounterByUserId, getUncompletedTasksCounterByUserId } from '../controllers/tasksController';

const tasksRouter = Router();

tasksRouter.post('/', createTask);
tasksRouter.patch('/', setTaskAsCompleted);
tasksRouter.delete('/', deleteTask);
tasksRouter.get('/search', fetchTasksByUserId);
tasksRouter.get('/completed/count', getCompletedTasksCounterByUserId);
tasksRouter.get('/uncompleted/count', getUncompletedTasksCounterByUserId);
tasksRouter.get('/', listAllTasks);

export default tasksRouter;

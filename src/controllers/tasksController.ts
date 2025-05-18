import { Request, Response} from 'express';
import Task from '../schemas/taskSchema';
import { z } from 'zod';

// POST
export const createTask = async (req: Request, res: Response) => {
    const data = new Task(req.body);
    
    try {
        const task = await Task.create(data);
		res.status(200).json({ message: 'Task created!', request_body: task});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

// PATCH
export const setTaskAsCompleted = async (req: Request, res: Response) => {
	// Get body data
    const taskId = req.query.taskId;
    
    try {
        const task = await Task.findByIdAndUpdate(taskId, {isCompleted:true}, {new:true});

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
        }

		res.status(201).json({ message: 'Task completed!', request_body: task});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

// DELETE
export const deleteTask = async (req: Request, res: Response) => {
    const taskId = req.query.taskId;

	try {
        const task = await Task.findByIdAndDelete(taskId);
		res.status(200).json({ message: 'Task deleted :c', response: task});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

// GET
export const fetchUncompletedTasksByUserId = async (req: Request, res: Response) => {
    const userId = req.query.userId;

	try {
        const tasks = await Task.find({userId, "isCompleted":false});

        if (!tasks || tasks.length === 0) {
    	    res.status(404).json({ message: 'No tasks linked to this user found'});
            return;
        }

		res.status(200).json({ message: 'Here are your tasks...', tasks});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

// GET
export const listAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find();
        res.json({ message: 'Here are all tasks...', tasks});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

// GET 
export const getCompletedTasksCounterByUserId = async (req: Request, res: Response) => {
    try {

        const userId = req.query.userId;

        //Fetch-filter from DB
        const completedTasks = await Task.find({userId, "isCompleted": true});
        const counter = completedTasks.length;

        res.json({ message: 'Completed tasks successfully fetched!', counter });

    } catch (error) {
        res.status(500).json({ message: 'internal server error', error });
    }
}

export const getUncompletedTasksCounterByUserId = async (req: Request, res: Response) => {
    try {

        const userId = req.query.userId;

        //Fetch-filter from DB
        const uncompletedTasks = await Task.find({userId, "isCompleted": false});
        const counter = uncompletedTasks.length;

        res.json({ message: 'Uncompleted tasks successfully fetched!', counter });

    } catch (error) {
        res.status(500).json({ message: 'internal server error', error });
    }
}
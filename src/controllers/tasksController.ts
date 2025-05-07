import { Request, Response} from 'express';
import Task from '../schemas/taskSchema';
import { z } from 'zod';

export const createTask = async (req: Request, res: Response) => {
    const data = new Task(req.body);
    
    try {
        const task = await Task.create(data);
		res.status(200).json({ message: 'Task completed!', request_body: task});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export const markTaskAsCompleted = async (req: Request, res: Response) => {
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

export const deleteTask = async (req: Request, res: Response) => {
	try {
		res.status(200).json({ message: 'Task deleted :c' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export const listTasksByUsername = async (req: Request, res: Response) => {
	try {
		res.status(200).json({ message: 'Here are your tasks...' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}
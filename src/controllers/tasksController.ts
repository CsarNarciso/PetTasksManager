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
export const fetchTasksByUserId = async (req: Request, res: Response) => {
    /*
        Fetch all tasks by userId and retrieve completed and uncompleted tasks count.
    */
    const userId = req.query.userId;

	try {
        const tasks = await Task.find({userId});

        if (!tasks || tasks.length === 0) {
    	    res.status(404).json({ message: 'No tasks linked to this user found'});
            return;
        }

        const completedCount = tasks.filter(task => task.isCompleted).length;
        const uncompletedCount = tasks.filter(task => !task.isCompleted).length;

		res.status(200).json(
            { 
                message: 'Here are your tasks...',
                tasks,
                completedCount: completedCount,
                uncompletedCount: uncompletedCount
            });
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
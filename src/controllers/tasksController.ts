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
    const taskId = req.body.taskId;
    const daysToReset = req.body.daysToReset;

    // Calculate date this task will be shown again
    const currentDate = new Date();
    const showAt = currentDate.setDate(currentDate.getDate() + daysToReset);
    
    try {
        const task = await Task.findByIdAndUpdate(taskId, {isCompleted:true, showAt}, {new:true});

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

    // Get today date to only get tasks to show today (or passed tasks, like, tomorrow not-fetched ones)
    const today = new Date();

	try {
        const tasks = await Task.find({userId, showAt: {$gte: today}});

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
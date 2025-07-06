import { Request, Response} from 'express';
import Task from '../schemas/taskSchema';
import { time } from 'console';

// POST
export const createTask = async (req: Request, res: Response) => {
    const data = new Task(req.body);
    
    const currentDate = new Date();
    data.showAt = currentDate;
    
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
    const timeToResetInSeconds = req.body.timeToResetInSeconds;

    // Calculate date this task will be shown again
    const originalCurrentDate = new Date();
    let currentDate = originalCurrentDate;
    const showAt = currentDate.setSeconds(currentDate.getSeconds() + timeToResetInSeconds);
    currentDate = originalCurrentDate;

    try {
        const task = await Task.findByIdAndUpdate(taskId, 
            {
                isCompleted:true, 
                showAt, 
                completedAt: currentDate
            },
        {new:true});

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

const sameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

// GET
export const fetchTasksByUserId = async (req: Request, res: Response) => {
    /*
        Fetch all tasks by userId and retrieve completed and uncompleted tasks count.
    */
    const userId = req.query.userId;

	try {

        // Get today date to only fetch tasks to show today (or passed tasks like: tomorrow not-fetched ones)
        // But also tasks that has been completed today
        const originalToday = new Date();
        let today = new Date(originalToday);
        const startOfToday = new Date(today.setHours(0,0,0,0));
        const endOfToday = new Date(today.setHours(23,59,59,999));
        today = originalToday;

        const tasks = await Task.find({userId, $or: 
            [{showAt: {$lte: today}}, 
            {completedAt: 
                {$gte: startOfToday, 
                $lte: endOfToday}
            }]
        });

        if (!tasks || tasks.length === 0) {
    	    res.status(404).json({ message: 'No tasks linked to this user found'});
            return;
        }

        // Update to-show-today tasks with done status to uncompleted one (reset)
        tasks.forEach(task => {
            if(task.isCompleted && (task.showAt && task.showAt.getTime() <= today.getTime()))
                task.isCompleted = false;
        });

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
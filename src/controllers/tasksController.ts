import { Request, Response} from 'express';
import Task from '../schemas/taskSchema';

// POST
export const createTask = async (req: Request, res: Response) => {
    const data = new Task(req.body);
    
    // Enable (show) task instantly
    const currentDate = new Date();
    data.showAt = currentDate;
    
    // Calculate time to reset (show again) task based on type
    
    // Handle daily time
    if(data.type && data.type == "d")
        data.timeToResetInSeconds = 60 * 60 * 24;
    
    // Custom type tasks already contain custom 'timeToResetInSeconds',
    // while One-use ones do not require this attribute (they auto-delete on complete)

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
        let task = await Task.findById(taskId); 

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        // Handle daily or custom tasks
        if(task.type != "o" && task.timeToResetInSeconds) {

            // Calculate date this task will be shown again
            const originalCurrentDate = new Date();
            let currentDate = new Date(originalCurrentDate);
            const showAt = new Date(currentDate.setSeconds(currentDate.getSeconds() + task.timeToResetInSeconds));
            currentDate = originalCurrentDate;
    
            task.isCompleted = true;
            task.showAt = showAt;
            task.completedAt = currentDate;
    
            const completedTask = await task.save();
            res.status(201).json({ message: 'Task completed!', request_body: completedTask});
            return;
        }

        // Handle one-use tasks (auto deletion)
        await task.deleteOne();
        res.status(204).json({ message: 'One-use task completed! Auto deleted'});

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
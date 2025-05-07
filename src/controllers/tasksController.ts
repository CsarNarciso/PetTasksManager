import { Request, Response} from 'express';
import taskSchema from '../schemas/taskSchema';

export const createTask = async (req: Request, res: Response) => {
	try {
		res.status(200).json({ message: 'Task created!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export const markTaskAsCompleted = async (req: Request, res: Response) => {
	try {
		res.status(200).json({ message: 'Task completed!' });
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
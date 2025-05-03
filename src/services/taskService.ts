import Task from '../schemas/taskSchema';

async function create(name) {
	
	const task = await Task.create({ name });
	return task;
}

//Make create function global/public
export default create;
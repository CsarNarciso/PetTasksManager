import User from '../schemas/userSchema';
import bcrypt from 'bcrypt';

async function create(data: any) {

    // Hash password
    data.password = await bcrypt.hash(data.password, 10);

    // Save in DB
    const newUser = await User.create(data);
    return newUser;
}


async function findByEmail(email: string) {
    return User.findOne({ email });
}

async function findByUsername(username: string) {
    return User.findOne({ username });
}
export default {create, findByEmail, findByUsername};
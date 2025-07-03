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

export async function deleteUser(username: string) {
    await User.findOneAndDelete({ username });
    // Verify user was deleted
    const user = await User.findOne({ username });
    if (!user) return true;
    return false;
}

export default {create, findByEmail, findByUsername};
import { User } from '../../schemas/userSchema';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
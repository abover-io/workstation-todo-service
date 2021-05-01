import { Router } from 'express';

import { UserController } from '@/controllers';
import { authenticate, Authorize } from '@/middlewares';

const UserRouter = Router();

UserRouter.use(authenticate);

UserRouter.put('/', Authorize.User, UserController.updateUser);

// UserRouter.patch('/verify')

UserRouter.patch('/', Authorize.User, UserController.updatePassword);
UserRouter.delete('/', Authorize.User, UserController.deleteUser);

export default UserRouter;

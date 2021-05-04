import { Router } from 'express';

import { UserController } from '@/controllers';
import { Authorize } from '@/middlewares';

const UserRouter = Router();

UserRouter.use(Authorize.User);

UserRouter.put('/:userId', UserController.UpdateUser);
UserRouter.put('/', UserController.UpdateUser);

// UserRouter.patch('/verify')

UserRouter.patch('/password/:userId', UserController.UpdatePassword);
UserRouter.patch('/password', UserController.UpdatePassword);

UserRouter.delete('/:userId', UserController.DeleteUser);
UserRouter.delete('/', UserController.DeleteUser);

export default UserRouter;

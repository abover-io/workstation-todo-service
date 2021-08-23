import { Router } from 'express';

import { UserController } from '@/controllers';
import { Authorize } from '@/middlewares';

const UserRouter = Router();

UserRouter.use(Authorize.User);

// UserRouter.patch('/verify')
// UserRouter.patch('/photo', UserController.UpdatePhoto);
UserRouter.patch('/name', UserController.UpdateName);
UserRouter.patch('/email', UserController.UpdateEmail);
UserRouter.patch('/password', UserController.UpdatePassword);

UserRouter.delete('/', UserController.DeleteUser);

export default UserRouter;

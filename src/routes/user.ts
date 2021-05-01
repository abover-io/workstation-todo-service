import { Router } from 'express';

import { UserController } from '@/controllers';
import { Authorize } from '@/middlewares';

const UserRouter = Router();

UserRouter.put('/:userId', Authorize.User, UserController.UpdateUser);
UserRouter.put('/', Authorize.User, UserController.UpdateUser);

// UserRouter.patch('/verify')

UserRouter.patch(
  '/password/:userId',
  Authorize.User,
  UserController.UpdatePassword,
);
UserRouter.patch('/password', Authorize.User, UserController.UpdatePassword);

UserRouter.delete('/:userId', Authorize.User, UserController.DeleteUser);
UserRouter.delete('/', Authorize.User, UserController.DeleteUser);

export default UserRouter;

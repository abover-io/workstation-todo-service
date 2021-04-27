import { Router } from 'express';
import csurf from 'csurf';

import { UserController } from '@/controllers';
import { authenticate, Authorize } from '@/middlewares';
import { decideCookieOptions } from '@/utils';

const UserRouter = Router();

UserRouter.use(
  csurf({
    cookie: {
      secure: decideCookieOptions('secure'),
      sameSite: decideCookieOptions('sameSite'),
    },
    value: (req) => req.cookies['XSRF-TOKEN'],
  }),
);

UserRouter.use(authenticate);

UserRouter.put(
  '/:username',
  Authorize.authorizeUser,
  UserController.updateUser,
);

// UserRouter.patch('/verify')

UserRouter.patch(
  '/:username',
  Authorize.authorizeUser,
  UserController.updatePassword,
);
UserRouter.delete(
  '/:username',
  Authorize.authorizeUser,
  UserController.deleteUser,
);

export default UserRouter;

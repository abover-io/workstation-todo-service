import { Router } from 'express';
import csurf from 'csurf';

import { UserController } from '@/controllers';
import { authenticate, Authorize } from '@/middlewares';

const userRouter = Router();

userRouter.post(
  '/refresh',
  csurf({ cookie: true, ignoreMethods: ['POST'] }),
  UserController.refreshToken
);
userRouter.post(
  '/signup',
  csurf({ cookie: true, ignoreMethods: ['POST'] }),
  UserController.signUp
);
userRouter.post(
  '/signin',
  csurf({ cookie: true, ignoreMethods: ['POST'] }),
  UserController.signIn
);

userRouter.use(csurf({ cookie: true }));

userRouter.use(authenticate);
userRouter.get('/sync', UserController.sync);
userRouter.post('/signout', UserController.signOut);
userRouter.put(
  '/:username',
  Authorize.authorizeUser,
  UserController.updateUser
);
userRouter.patch(
  '/:username',
  Authorize.authorizeUser,
  UserController.updatePassword
);
userRouter.delete(
  '/:username',
  Authorize.authorizeUser,
  UserController.deleteUser
);

export default userRouter;

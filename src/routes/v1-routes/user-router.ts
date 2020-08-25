import { Router } from 'express';
import csurf from 'csurf';

import { UserControllerV1 } from '@/controllers/v1-controllers';
import { authenticate, Authorize } from '@/middlewares';

const userRouter = Router();

userRouter.post(
  '/refresh',
  csurf({ cookie: true, ignoreMethods: ['POST'] }),
  UserControllerV1.refreshToken
);
userRouter.post(
  '/signup',
  csurf({ cookie: true, ignoreMethods: ['POST'] }),
  UserControllerV1.signUp
);
userRouter.post(
  '/signin',
  csurf({ cookie: true, ignoreMethods: ['POST'] }),
  UserControllerV1.signIn
);
userRouter.post('/signout', UserControllerV1.signOut);

userRouter.use(csurf({ cookie: true }));

userRouter.use(authenticate);

userRouter.get('/sync', UserControllerV1.sync);
userRouter.put(
  '/:username',
  Authorize.authorizeUser,
  UserControllerV1.updateUser
);
userRouter.patch(
  '/:username',
  Authorize.authorizeUser,
  UserControllerV1.updatePassword
);
userRouter.delete(
  '/:username',
  Authorize.authorizeUser,
  UserControllerV1.deleteUser
);

export default userRouter;

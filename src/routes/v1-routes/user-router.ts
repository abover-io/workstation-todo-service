import { Router } from 'express';
import csurf from 'csurf';

import { UserControllerV1 } from '@/controllers/v1-controllers';
import { authenticate, Authorize } from '@/middlewares';
import { decideCookieOptions } from '@/utils';

const userRouter = Router();

userRouter.post(
  '/refresh',
  csurf({
    cookie: {
      secure: decideCookieOptions('secure'),
      sameSite: decideCookieOptions('sameSite'),
    },
    ignoreMethods: ['POST'],
  }),
  UserControllerV1.refreshToken,
);

userRouter.post(
  '/signup',
  csurf({
    cookie: {
      secure: decideCookieOptions('secure'),
      sameSite: decideCookieOptions('sameSite'),
    },
    ignoreMethods: ['POST'],
  }),
  UserControllerV1.signUp,
);

userRouter.post(
  '/signin',
  csurf({
    cookie: {
      secure: decideCookieOptions('secure'),
      sameSite: decideCookieOptions('sameSite'),
    },
    ignoreMethods: ['POST'],
  }),
  UserControllerV1.signIn,
);

userRouter.post(
  '/auth/google',
  csurf({
    cookie: {
      secure: decideCookieOptions('secure'),
      sameSite: decideCookieOptions('sameSite'),
    },
    ignoreMethods: ['POST'],
  }),
  UserControllerV1.googleSignIn,
);
// userRouter.post('/auth/github');
// userRouter.post('/auth/linkedin');
// userRouter.post('/auth/apple');

userRouter.post('/signout', UserControllerV1.signOut);
// userRouter.post('/signout/google');
// userRouter.post('/signout/github');
// userRouter.post('/signout/linkedin');
// userRouter.post('/signout/apple');

userRouter.use(
  csurf({
    cookie: {
      secure: decideCookieOptions('secure'),
      sameSite: decideCookieOptions('sameSite'),
    },
    value: (req) => req.cookies['XSRF-TOKEN'],
  }),
);

userRouter.use(authenticate);

userRouter.get('/sync', UserControllerV1.sync);
userRouter.put(
  '/:username',
  Authorize.authorizeUser,
  UserControllerV1.updateUser,
);

// userRouter.patch('/verify')

userRouter.patch(
  '/:username',
  Authorize.authorizeUser,
  UserControllerV1.updatePassword,
);
userRouter.delete(
  '/:username',
  Authorize.authorizeUser,
  UserControllerV1.deleteUser,
);

export default userRouter;

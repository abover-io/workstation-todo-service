import { Router } from 'express';
import csurf from 'csurf';

// Middlewares
import authenticate from '@/middlewares/authenticate';

// Controllers
import { AuthController } from '@/controllers';

// Utils
import { decideCookieOptions } from '@/utils';

const AuthRouter = Router();

AuthRouter.post(
  '/refresh',
  csurf({
    cookie: {
      secure: decideCookieOptions('secure'),
      sameSite: decideCookieOptions('sameSite'),
    },
    ignoreMethods: ['POST'],
  }),
  AuthController.refreshToken,
);

AuthRouter.post(
  '/signup',
  csurf({
    cookie: {
      secure: decideCookieOptions('secure'),
      sameSite: decideCookieOptions('sameSite'),
    },
    ignoreMethods: ['POST'],
  }),
  AuthController.signUp,
);

AuthRouter.post(
  '/signin',
  csurf({
    cookie: {
      secure: decideCookieOptions('secure'),
      sameSite: decideCookieOptions('sameSite'),
    },
    ignoreMethods: ['POST'],
  }),
  AuthController.signIn,
);

AuthRouter.post(
  '/auth/google',
  csurf({
    cookie: {
      secure: decideCookieOptions('secure'),
      sameSite: decideCookieOptions('sameSite'),
    },
    ignoreMethods: ['POST'],
  }),
  AuthController.googleSignIn,
);

AuthRouter.post('/signout', AuthController.signOut);

AuthRouter.use(
  csurf({
    cookie: {
      secure: decideCookieOptions('secure'),
      sameSite: decideCookieOptions('sameSite'),
    },
    value: (req) => req.cookies['XSRF-TOKEN'],
  }),
);

AuthRouter.use(authenticate);

AuthRouter.get('/sync', AuthController.sync);

export default AuthRouter;

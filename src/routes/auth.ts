import { Router } from 'express';
import csurf from 'csurf';

// Middlewares
import authenticate from '@/middlewares/authenticate';

// Controllers
import { AuthController } from '@/controllers';

const AuthRouter = Router();

AuthRouter.post(
  '/refresh',
  csurf({
    cookie: true,
    ignoreMethods: ['POST'],
  }),
  AuthController.RefreshToken,
);

AuthRouter.post(
  '/signup',
  csurf({
    cookie: true,
    ignoreMethods: ['POST'],
  }),
  AuthController.SignUp,
);

AuthRouter.post(
  '/signin',
  csurf({
    cookie: true,
    ignoreMethods: ['POST'],
  }),
  AuthController.SignIn,
);

AuthRouter.post(
  '/auth/google',
  csurf({
    cookie: true,
    ignoreMethods: ['POST'],
  }),
  AuthController.GoogleSignIn,
);

AuthRouter.post(
  '/signout',
  csurf({
    cookie: true,
    ignoreMethods: ['POST'],
  }),
  AuthController.SignOut,
);

AuthRouter.use(
  csurf({
    cookie: true,
  }),
);

AuthRouter.use(authenticate);

AuthRouter.get('/sync', AuthController.Sync);

export default AuthRouter;

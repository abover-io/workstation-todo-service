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
    ignoreMethods: ['POST'],
  }),
  AuthController.RefreshToken,
);

AuthRouter.post(
  '/signup',
  csurf({
    ignoreMethods: ['POST'],
  }),
  AuthController.SignUp,
);

AuthRouter.post(
  '/signin',
  csurf({
    ignoreMethods: ['POST'],
  }),
  AuthController.SignIn,
);

AuthRouter.post(
  '/auth/google',
  csurf({
    ignoreMethods: ['POST'],
  }),
  AuthController.GoogleSignIn,
);

AuthRouter.post('/signout', AuthController.SignOut);

AuthRouter.use(
  csurf({
    value: (req) => req.cookies['XSRF-TOKEN'],
  }),
);

AuthRouter.use(authenticate);

AuthRouter.get('/sync', AuthController.Sync);

export default AuthRouter;

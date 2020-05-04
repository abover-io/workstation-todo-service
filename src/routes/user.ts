import { Router } from 'express';
import UserController from '../controllers/user';
import Authorize from '../middlewares/authorize';
import authenticate from '../middlewares/authenticate';

const userRouter = Router();

userRouter.post('/refresh', UserController.refreshToken);
userRouter.post('/signup', UserController.signUp);
userRouter.post('/signin', UserController.signIn);
userRouter.use(authenticate);
userRouter.post('/signout', UserController.signOut);
userRouter.put('/:username', Authorize.authorizeUser, UserController.updateProfile);
userRouter.patch(
  '/:username',
  Authorize.authorizeUser,
  UserController.updatePassword
);
userRouter.delete('/:username', Authorize.authorizeUser, UserController.delete);

export default userRouter;

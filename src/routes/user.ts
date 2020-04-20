import { Router } from 'express';
import UserController from '../controllers/user';
import Authorize from '../middlewares/authorize';
import authenticate from '../middlewares/authenticate';

const userRouter = Router();
const authorize = new Authorize();

userRouter.get('/check', UserController.check);
userRouter.post('/signup', UserController.signUp);
userRouter.post('/signin', UserController.signIn);
userRouter.use(authenticate);
userRouter.put('/:username', authorize.authorizeUser, UserController.updatePut);
userRouter.patch(
  '/:username',
  authorize.authorizeUser,
  UserController.updatePatch
);
userRouter.delete('/:username', authorize.authorizeUser, UserController.delete);

export default userRouter;

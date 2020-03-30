import { Router } from 'express';
import UserController from '../controllers/user';
import Authorize from '../middlewares/authorize';
import authenticate from '../middlewares/authenticate';

const userRouter = Router();
const authorize = new Authorize();

userRouter.post('/signup', UserController.signUp);
userRouter.post('/signin', UserController.signIn);
userRouter.use(authenticate);
userRouter.put('/:userId', authorize.authorizeUser, UserController.updatePut);
userRouter.patch(
  '/:userId',
  authorize.authorizeUser,
  UserController.updatePatch
);
userRouter.delete('/:userId', authorize.authorizeUser, UserController.delete);

export default userRouter;

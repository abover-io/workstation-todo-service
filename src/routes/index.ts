import { Router } from 'express';

import userRouter from './user';
import todoRouter from './todo';
import errorHandler from '../middlewares/errorHandler';

const router = Router();

router.use('/users', userRouter);
router.use('/todos', todoRouter);

router.use(errorHandler);

router.use(function (req, res, next) {
  res.send('Please refer to Fancy Todo API Docs!');
});

export default router;

import { Router } from 'express';

import { errorHandler } from '@/middlewares';

import routerV1 from './v1-routes';

const mainRouter = Router();

mainRouter.use('/v1', routerV1);

mainRouter.use(errorHandler);

mainRouter.use(function (req, res, next) {
  res.redirect('https://github.com/sunday-projects/fancy-todo-api');
  // res.redirect('https://todo.sundayexplore.tech/docs/v1');
});

export default mainRouter;

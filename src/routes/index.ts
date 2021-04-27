import { Router } from 'express';
import moment from 'moment';

// Routers
import AuthRouter from './auth';
import UserRouter from './user';
import ListRouter from './list';

const MainRouter = Router();

MainRouter.get('/', (_, res) => {
  return res.status(200).json({
    service: 'Fancy Todo',
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
  });
});

MainRouter.use('/auth', AuthRouter);
MainRouter.use('/users', UserRouter);
MainRouter.use('/lists', ListRouter);

export default MainRouter;

import { Router } from 'express';
import moment from 'moment';
import csurf from 'csurf';

// Routers
import AuthRouter from './auth';
import UserRouter from './user';
import ListRouter from './list';
import TodoRouter from './todo';
import SubtodoRouter from './subtodo';

const MainRouter = Router();

MainRouter.get('/', (_, res) => {
  return res.status(200).json({
    service: 'Fancy Todo',
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
  });
});

MainRouter.use('/auth', AuthRouter);

UserRouter.use(
  csurf({
    cookie: true,
  }),
);

MainRouter.use('/users', UserRouter);
MainRouter.use('/lists', ListRouter);
MainRouter.use('/todos', TodoRouter);
MainRouter.use('/subtodos', SubtodoRouter);

export default MainRouter;

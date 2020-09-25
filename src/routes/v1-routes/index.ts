import { Router } from 'express';

import userRouter from './user-router';
import todoRouter from './todo-router';

const routerV1 = Router();

routerV1.use('/users', userRouter);
routerV1.use('/todos', todoRouter);

export default routerV1;
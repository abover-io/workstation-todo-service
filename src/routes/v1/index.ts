import { Router } from 'express';

import userRouter from './user-router-v1';
import todoRouter from './todo-router-v1';

const routerV1 = Router();

routerV1.get('/sync')
routerV1.use('/users', userRouter);
routerV1.use('/todos', todoRouter);

export default routerV1;

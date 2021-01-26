import { Router } from 'express';

// Routers
import userRouter from './user-router';
import todoRouter from './todo-router';

const mainRouter = Router();

mainRouter.use('/users', userRouter);
mainRouter.use('/todos', todoRouter);

export default mainRouter;

import { Router } from 'express';

import Authorize from '../middlewares/authorize';
import TodoController from '../controllers/todo';

const todoRouter = Router();
const authorize = new Authorize();

todoRouter.get('/:userId', TodoController.findAll);
todoRouter.get('/:userId/:todoId', TodoController.findOne);
todoRouter.post('/:userId', TodoController.create);
todoRouter.put('/:userId/:todoId', authorize.authorizeTodo, TodoController.update);
todoRouter.delete('/:userId/:todoId', authorize.authorizeTodo, TodoController.delete);

export default todoRouter;

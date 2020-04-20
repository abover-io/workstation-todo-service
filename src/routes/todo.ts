import { Router } from 'express';

import Authorize from '../middlewares/authorize';
import authenticate from '../middlewares/authenticate';
import TodoController from '../controllers/todo';

const todoRouter = Router();
const authorize = new Authorize();

todoRouter.use(authenticate);
todoRouter.get('/:username', TodoController.findAll);
todoRouter.get('/:username/:todoId', TodoController.findOne);
todoRouter.post('/:username', TodoController.create);
todoRouter.put('/:username/:todoId', authorize.authorizeTodo, TodoController.update);
todoRouter.delete('/:username/:todoId', authorize.authorizeTodo, TodoController.delete);

export default todoRouter;

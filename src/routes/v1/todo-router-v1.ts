import { Router } from 'express';
import csurf from 'csurf';

import Authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import { TodoController } from '@/controllers';

const todoRouter = Router();

todoRouter.use(csurf({ cookie: true }));
todoRouter.use(authenticate);
todoRouter.get('/', TodoController.getTodos);
todoRouter.get('/:todoId', TodoController.getTodo);
todoRouter.post('/', TodoController.addTodo);
todoRouter.put('/:todoId', Authorize.authorizeTodo, TodoController.updateTodo);
todoRouter.patch(
  '/complete/:todoId',
  Authorize.authorizeTodo,
  TodoController.completeTodo
);
todoRouter.patch(
  '/uncomplete/:todoId',
  Authorize.authorizeTodo,
  TodoController.uncompleteTodo
);
todoRouter.delete(
  '/:todoId',
  Authorize.authorizeTodo,
  TodoController.deleteTodo
);

export default todoRouter;

import { Router } from 'express';
import csurf from 'csurf';

import Authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import { TodoControllerV1 } from '@/controllers/v1-controllers';

const todoRouter = Router();

todoRouter.use(csurf({ cookie: true }));
todoRouter.use(authenticate);
todoRouter.get('/', TodoControllerV1.getTodos);
todoRouter.get('/:todoId', TodoControllerV1.getTodo);
todoRouter.post('/', TodoControllerV1.addTodo);
todoRouter.put('/:todoId', Authorize.authorizeTodo, TodoControllerV1.updateTodo);
todoRouter.patch(
  '/complete/:todoId',
  Authorize.authorizeTodo,
  TodoControllerV1.completeTodo
);
todoRouter.patch(
  '/uncomplete/:todoId',
  Authorize.authorizeTodo,
  TodoControllerV1.uncompleteTodo
);
todoRouter.delete(
  '/:todoId',
  Authorize.authorizeTodo,
  TodoControllerV1.deleteTodo
);

export default todoRouter;

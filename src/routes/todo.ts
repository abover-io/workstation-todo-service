import { Router } from 'express';

import Authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import { TodoController } from '@/controllers';

const TodoRouter = Router();

TodoRouter.use(authenticate);
TodoRouter.get('/', TodoController.getTodos);
TodoRouter.get('/:todoId', TodoController.getTodo);
TodoRouter.post('/', TodoController.addTodo);
TodoRouter.put('/:todoId', Authorize.authorizeTodo, TodoController.updateTodo);
TodoRouter.patch(
  '/complete/:todoId',
  Authorize.authorizeTodo,
  TodoController.completeTodo,
);
TodoRouter.patch(
  '/uncomplete/:todoId',
  Authorize.authorizeTodo,
  TodoController.uncompleteTodo,
);
TodoRouter.delete(
  '/:todoId',
  Authorize.authorizeTodo,
  TodoController.deleteTodo,
);

export default TodoRouter;

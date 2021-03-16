import { Router } from 'express';
import csurf from 'csurf';

import Authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import { TodoController } from '@/controllers';
import { decideCookieOptions } from '@/utils';

const TodoRouter = Router();

TodoRouter.use(
  csurf({
    cookie: {
      secure: decideCookieOptions('secure'),
      sameSite: decideCookieOptions('sameSite'),
    },
    value: (req) => req.cookies['XSRF-TOKEN'],
  }),
);
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

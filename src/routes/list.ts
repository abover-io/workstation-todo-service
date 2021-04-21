import { Router } from 'express';
import csurf from 'csurf';

import Authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import { ListController } from '@/controllers';
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
TodoRouter.get('/', ListController.getAllLists);
TodoRouter.post('/', ListController.createList);
TodoRouter.put('/:todoId', Authorize.authorizeTodo, ListController.updateList);
TodoRouter.delete(
  '/:todoId',
  Authorize.authorizeTodo,
  ListController.deleteList,
);

export default TodoRouter;

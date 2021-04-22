import { Router } from 'express';
import csurf from 'csurf';

import Authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import { ListController } from '@/controllers';
import { decideCookieOptions } from '@/utils';

const ListRouter = Router();

ListRouter.use(
  csurf({
    cookie: {
      secure: decideCookieOptions('secure'),
      sameSite: decideCookieOptions('sameSite'),
    },
    value: (req) => req.cookies['XSRF-TOKEN'],
  }),
);
ListRouter.use(authenticate);
ListRouter.get('/', ListController.getAllLists);
ListRouter.post('/', ListController.createList);
ListRouter.put('/:listId', Authorize.authorizeTodo, ListController.updateList);
ListRouter.delete(
  '/:listId',
  Authorize.authorizeTodo,
  ListController.deleteList,
);

export default ListRouter;

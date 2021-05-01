import { Router } from 'express';

import Authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import { ListController } from '@/controllers';

const ListRouter: Router = Router();

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

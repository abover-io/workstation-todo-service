import { Router } from 'express';

import Authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import { ListController } from '@/controllers';

const ListRouter: Router = Router();

ListRouter.use(authenticate);
ListRouter.get('/', ListController.GetAllLists);
ListRouter.post('/', ListController.CreateList);
ListRouter.put('/:listId', Authorize.List, ListController.UpdateList);
ListRouter.delete('/:listId', Authorize.List, ListController.DeleteList);

export default ListRouter;

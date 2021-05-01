import { Router } from 'express';

import { Authorize } from '@/middlewares';
import { ListController } from '@/controllers';

const ListRouter: Router = Router();

ListRouter.get('/', ListController.GetAllLists);

ListRouter.post('/', ListController.CreateList);

ListRouter.use(Authorize.List);

ListRouter.put('/:listId', ListController.UpdateList);
ListRouter.put('/', ListController.UpdateList);

ListRouter.delete('/:listId', ListController.DeleteList);
ListRouter.delete('/', ListController.DeleteList);

export default ListRouter;

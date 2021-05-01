import { Router } from 'express';

import { Authorize } from '@/middlewares';
import { SubtodoController } from '@/controllers';

const SubtodoRouter: Router = Router();

SubtodoRouter.get('/', SubtodoController.GetAllSubtodos);

SubtodoRouter.post('/', SubtodoController.CreateSubtodo);

SubtodoRouter.use(Authorize.Subtodo);

SubtodoRouter.put('/:subtodoId', SubtodoController.UpdateSubtodo);
SubtodoRouter.put('/', SubtodoController.UpdateSubtodo);

SubtodoRouter.patch('/complete/:subtodoId', SubtodoController.CompleteSubtodo);
SubtodoRouter.patch('/complete', SubtodoController.CompleteSubtodo);
SubtodoRouter.patch(
  '/uncomplete/:subtodoId',
  SubtodoController.UncompleteSubtodo,
);
SubtodoRouter.patch('/uncomplete', SubtodoController.UncompleteSubtodo);

SubtodoRouter.delete('/:subtodoId', SubtodoController.DeleteSubtodo);
SubtodoRouter.delete('/', SubtodoController.DeleteSubtodo);

export default SubtodoRouter;

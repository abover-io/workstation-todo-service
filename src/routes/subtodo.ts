import { Router } from 'express';

import Authorize from '@/middlewares/authorize';
import authenticate from '@/middlewares/authenticate';
import { SubtodoController } from '@/controllers';

const SubtodoRouter: Router = Router();

SubtodoRouter.use(authenticate);
SubtodoRouter.get('/', SubtodoController.GetAllSubtodos);
SubtodoRouter.post('/', SubtodoController.CreateSubtodo);
SubtodoRouter.put(
  '/:subtodoId',
  Authorize.Subtodo,
  SubtodoController.UpdateSubtodo,
);
SubtodoRouter.patch(
  '/complete/:subtodoId',
  Authorize.Subtodo,
  SubtodoController.CompleteSubtodo,
);
SubtodoRouter.patch(
  '/uncomplete/:subtodoId',
  Authorize.Subtodo,
  SubtodoController.UncompleteSubtodo,
);
SubtodoRouter.delete(
  '/:subtodoId',
  Authorize.Subtodo,
  SubtodoController.DeleteSubtodo,
);

export default SubtodoRouter;

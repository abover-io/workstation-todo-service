import { Router } from 'express';

import { Authorize } from '@/middlewares';
import { TodoController } from '@/controllers';

const TodoRouter = Router();

TodoRouter.get('/', TodoController.getTodos);

TodoRouter.post('/', TodoController.addTodo);

TodoRouter.use(Authorize.Todo);

TodoRouter.put('/:todoId', TodoController.updateTodo);
TodoRouter.put('/', TodoController.updateTodo);

TodoRouter.patch('/complete/:todoId', TodoController.completeTodo);
TodoRouter.patch('/complete', TodoController.completeTodo);
TodoRouter.patch('/uncomplete/:todoId', TodoController.uncompleteTodo);
TodoRouter.patch('/uncomplete', TodoController.uncompleteTodo);

TodoRouter.delete('/:todoId', TodoController.deleteTodo);
TodoRouter.delete('/', TodoController.deleteTodo);

export default TodoRouter;

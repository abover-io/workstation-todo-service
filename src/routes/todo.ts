import { Router } from 'express';

import { Authorize } from '@/middlewares';
import { TodoController } from '@/controllers';

const TodoRouter = Router();

TodoRouter.get('/:listId', TodoController.GetTodosByListID);
TodoRouter.get('/', TodoController.GetAllTodos);

TodoRouter.post('/:listId', TodoController.CreateTodo);
TodoRouter.post('/', TodoController.CreateTodo);

TodoRouter.use(Authorize.Todo);

TodoRouter.put('/:todoId', TodoController.UpdateTodo);
TodoRouter.put('/', TodoController.UpdateTodo);

TodoRouter.patch('/complete/:todoId', TodoController.CompleteTodo);
TodoRouter.patch('/complete', TodoController.CompleteTodo);
TodoRouter.patch('/uncomplete/:todoId', TodoController.UncompleteTodo);
TodoRouter.patch('/uncomplete', TodoController.UncompleteTodo);

TodoRouter.delete('/:todoId', TodoController.DeleteTodo);
TodoRouter.delete('/', TodoController.DeleteTodo);

export default TodoRouter;

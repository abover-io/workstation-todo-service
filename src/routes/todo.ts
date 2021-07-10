import { Router } from 'express';

import { Authorize } from '@/middlewares';
import { TodoController } from '@/controllers';

const TodoRouter = Router();

TodoRouter.get('/', TodoController.GetAllTodos);

TodoRouter.post('/', TodoController.AddTodo);

TodoRouter.put('/:todoId', Authorize.Todo, TodoController.UpdateTodo);
TodoRouter.put('/', Authorize.Todo, TodoController.UpdateTodo);

TodoRouter.patch(
  '/complete/:todoId',
  Authorize.Todo,
  TodoController.CompleteTodo,
);
TodoRouter.patch('/complete', Authorize.Todo, TodoController.CompleteTodo);
TodoRouter.patch(
  '/uncomplete/:todoId',
  Authorize.Todo,
  TodoController.UncompleteTodo,
);
TodoRouter.patch('/uncomplete', Authorize.Todo, TodoController.UncompleteTodo);
TodoRouter.patch(
  '/priority/:todoId',
  Authorize.Todo,
  TodoController.UpdateTodoPriority,
);
TodoRouter.patch(
  '/priority',
  Authorize.Todo,
  TodoController.UpdateTodoPriority,
);
TodoRouter.patch(
  '/list/:todoId',
  Authorize.Todo,
  TodoController.UpdateTodoList,
);
TodoRouter.patch('/list', Authorize.Todo, TodoController.UpdateTodoList);

TodoRouter.delete('/:todoId', Authorize.Todo, TodoController.DeleteTodo);
TodoRouter.delete('/', Authorize.Todo, TodoController.DeleteTodo);

export default TodoRouter;

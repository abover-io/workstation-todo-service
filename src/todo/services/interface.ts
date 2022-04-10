import { Moment } from 'moment';
import { TodoList, Todo } from '@/todo/models';

export interface SuccessPayload {
  success: true;
  timestamp: Moment | Date | string;
}

export interface EditTodoListPayload {
  list_id: string;
  name: string;
}

export interface EditTodoPayload {
  todo_id: string;
  completed_at?: Moment | Date | string;
}

export default interface ITodoService {
  addTodoList(user_id: number): Promise<TodoList>;
  addTodo(list_id: string): Promise<Todo>;

  getTodoLists(user_id: number): Promise<TodoList[]>;
  getTodoList(list_id: string): Promise<TodoList>;

  editTodoList(payload: EditTodoListPayload): Promise<SuccessPayload>;
  editTodo(payload: EditTodoPayload): Promise<SuccessPayload>;

  deleteTodoList(list_id: string): Promise<SuccessPayload>;
  deleteTodo(todo_id: string): Promise<SuccessPayload>;
}

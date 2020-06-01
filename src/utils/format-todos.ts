import moment from 'moment';

import { ITodo } from '@/types';

export default function formatTodos<T = ITodo[] | ITodo>(
  todos: T | ITodo[] | ITodo,
  flavor: 'completed' | 'uncompleted' | 'both' = 'completed'
): T | ITodo[] | ITodo {
  /**
   * Date & Time Formatting Phase
   */

  if (todos instanceof Array) {
    todos = todos.map((todo) => {
      if (todo.due) {
        todo.dueDate = moment(todo.due).format('LL');
        todo.dueTime = moment(todo.due).format('LT');
        return todo;
      }
      return todo;
    });

    /**
     * Flavor Matching Phase
     */

    switch (flavor) {
      case 'completed':
        todos = todos.filter((todo) => todo.completed);
        break;

      case 'uncompleted':
        todos = todos.filter((todo) => !todo.completed);
        break;

      case 'both':
        // NOTHING TO DO HERE, JUST A PLACEHOLDER.
        break;
    }
  } else if (todos instanceof Object) {
    if (todos.due) {
      todos.dueDate = moment(todos.due).format('LL');
      todos.dueTime = moment(todos.due).format('LT');
    }
  }

  return todos;
}

import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import createError from 'http-errors';

import { ITodo, IRequestIO } from '@/types';
import { Todo } from '@/models';
import { formatTodos } from '@/utils';

const { ObjectId } = Types;

export default class TodoController {
  static async getTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = (<any>req).user;
      let todos: ITodo[] | any = await Todo.find({
        username,
      });

      todos = formatTodos<ITodo[]>(todos, 'completed');

      return res.status(200).json({
        todos,
        message: `Successfully fetched all todos with ${todos.length} in total!`,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = (<any>req).user;
      const { todoId } = req.params;
      let todo: ITodo | any = await Todo.findOne({
        $and: [
          {
            _id: ObjectId(todoId),
          },
          {
            username,
          },
        ],
      });

      if (!todo) {
        throw createError({
          name: 'NotFoundError',
          message: `Cannot get, no todo whose ID is ${todoId} found!`,
        });
      }

      todo = formatTodos<ITodo>(todo);

      return res
        .status(200)
        .json({ todo, message: 'Successfully fetched specified todo!' });
    } catch (err) {
      return next(err);
    }
  }

  static async addTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = (<any>req).user;
      const { io } = req as IRequestIO;
      const { name, due, priority = 0 }: ITodo = req.body;
      let todo: ITodo | any = await Todo.create({
        username,
        name,
        due,
        priority,
      });
      let todos: ITodo[] | any = await Todo.find({ username });

      todo = formatTodos<ITodo>(todo);
      todos = formatTodos<ITodo[]>(todos);

      io.emit(`${username}-refresh-todos`, { todos });

      return res
        .status(201)
        .json({ todo, message: 'Successfully created todo!' });
    } catch (err) {
      next(err);
    }
  }

  static async updateTodo(req: Request, res: Response, next: NextFunction) {
    const { username } = (<any>req).user;
    const { todoId } = req.params;
    const { io } = req as IRequestIO;
    const { name, due, priority = 0, position = null }: ITodo = req.body;
    const defaultError = createError({
      name: 'NotFoundError',
      message: `Cannot update, no todo whose ID is ${todoId} found!`,
    });

    try {
      let todo: ITodo | any = await Todo.findOneAndUpdate(
        {
          $and: [
            {
              _id: ObjectId(todoId),
            },
            {
              username,
            },
          ],
        },
        {
          name,
          due,
          priority,
          position,
        },
        { new: true },
      );
      let todos: ITodo[] | any = await Todo.find({ username });

      if (!todo) {
        throw defaultError;
      }

      todo = formatTodos<ITodo>(todo);
      todos = formatTodos<ITodo[]>(todos);

      io.emit(`${username}-refresh-todos`, { todos });

      res.status(200).json({ todo, message: 'Successfully updated todo!' });
    } catch (err) {
      next(defaultError);
    }
  }

  static async completeTodo(req: Request, res: Response, next: NextFunction) {
    const { username } = (<any>req).user;
    const { todoId } = req.params;
    const { io } = req as IRequestIO;
    const defaultError = createError({
      name: 'NotFoundError',
      message: `Cannot complete, no todo whose ID is ${todoId} found!`,
    });

    try {
      let todo: ITodo | any = await Todo.findOneAndUpdate(
        {
          $and: [
            {
              _id: ObjectId(todoId),
            },
            {
              username,
            },
          ],
        },
        {
          completed: true,
        },
        {
          new: true,
        },
      );
      let todos: ITodo[] | any = await Todo.find({ username });

      if (!todo) {
        throw defaultError;
      }

      todo = formatTodos<ITodo>(todo);
      todos = formatTodos<ITodo[]>(todos);

      io.emit(`${username}-refresh-todos`, { todos });

      res.status(200).json({ todo, message: 'Successfully completed todo!' });
    } catch (err) {
      next(defaultError);
    }
  }

  static async uncompleteTodo(req: Request, res: Response, next: NextFunction) {
    const { username } = (<any>req).user;
    const { todoId } = req.params;
    const { io } = req as IRequestIO;
    const defaultError = createError({
      name: 'NotFoundError',
      message: `Cannot uncomplete, no todo whose ID is ${todoId} found!`,
    });

    try {
      let todo: ITodo | any = await Todo.findOneAndUpdate(
        {
          $and: [
            {
              _id: ObjectId(todoId),
            },
            {
              username,
            },
          ],
        },
        { completed: false },
        { new: true },
      );
      let todos: ITodo[] | any = await Todo.find({ username });

      if (!todo) {
        throw createError({
          name: 'NotFoundError',
          message: `Cannot uncomplete, no todo whose ID is ${todoId} found!`,
        });
      }

      todo = formatTodos<ITodo>(todo);
      todos = formatTodos<ITodo[]>(todos);

      io.emit(`${username}-refresh-todos`, { todos });

      res.status(200).json({ todo, message: 'Successfully uncompleted todo!' });
    } catch (err) {
      next(defaultError);
    }
  }

  static async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = (<any>req).user;
      const { todoId } = req.params;
      const { io } = req as IRequestIO;
      let todo: ITodo | any = await Todo.findOneAndDelete({
        $and: [
          {
            _id: ObjectId(todoId),
          },
          {
            username,
          },
        ],
      });
      let todos: ITodo[] | any = await Todo.find({ username });

      if (!todo) {
        throw createError({
          name: 'NotFoundError',
          message: `Cannot delete, no todo whose ID is ${todoId} found!`,
        });
      }

      todo = formatTodos<ITodo>(todo);
      todos = formatTodos<ITodo[]>(todos);

      io.emit(`${username}-refresh-todos`, { todos });

      return res
        .status(200)
        .json({ todo, message: 'Successfully deleted todo!' });
    } catch (err) {
      return next(err);
    }
  }
}

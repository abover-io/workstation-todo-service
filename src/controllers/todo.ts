import { Request, Response, NextFunction } from 'express';
import { Types, QueryOptions, MongooseFilterQuery } from 'mongoose';
import createError from 'http-errors';

// Typings
import { ITodoDocument } from '@/types/todo';

// Models
import { Todo } from '@/models';

const { ObjectId } = Types;

export default class TodoController {
  public static async getTodos(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { username } = (<any>req).user;

      const options: QueryOptions = {
        limit: 100,
        skip: 0,
      };

      const conditions: MongooseFilterQuery<
        Pick<ITodoDocument, keyof ITodoDocument>
      > = {
        username,
        completed: false,
      };

      const todos: ITodoDocument[] | any = await Todo.find(
        {
          username,
          completed: false,
        },
        null,
        options,
      );

      const totalTodos: number = await Todo.countDocuments({ username });

      return res.status(200).json({
        message: `Successfully fetched all todos with ${todos.length} in total!`,
        count: todos.length,
        total: totalTodos,
        todos,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async getTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = (<any>req).user;
      const { todoId } = req.params;
      const todo: ITodoDocument | any = await Todo.findOne({
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

      return res.status(200).json({
        todo,
        message: `Successfully fetched todo whose ID is ${todoId}!`,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async addTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = (<any>req).user;
      const {
        name,
        due,
        isTimeSet = false,
        priority = 4,
      }: ITodoDocument = req.body;
      const todo: ITodoDocument | any = await Todo.create({
        username,
        name,
        due,
        isTimeSet,
        priority,
      });

      return res
        .status(201)
        .json({ todo, message: 'Successfully added todo!' });
    } catch (err) {
      return next(err);
    }
  }

  public static async updateTodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { username } = (<any>req).user;
    const { todoId } = req.params;
    const {
      name,
      due,
      isTimeSet = false,
      priority = 4,
      position = null,
    }: ITodoDocument = req.body;
    const defaultError = createError({
      name: 'NotFoundError',
      message: `Cannot update, no todo whose ID is ${todoId} found!`,
    });

    try {
      const todo: ITodoDocument | any = await Todo.findOneAndUpdate(
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
          isTimeSet,
          priority,
          position,
        },
        { new: true },
      );

      if (!todo) {
        throw defaultError;
      }

      return res
        .status(200)
        .json({ todo, message: 'Successfully updated todo!' });
    } catch (err) {
      return next(defaultError);
    }
  }

  public static async completeTodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { username } = (<any>req).user;
    const { todoId } = req.params;
    const defaultError = createError({
      name: 'NotFoundError',
      message: `Cannot complete, no todo whose ID is ${todoId} found!`,
    });

    try {
      const todo: ITodoDocument | any = await Todo.findOneAndUpdate(
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

      if (!todo) {
        throw defaultError;
      }

      return res
        .status(200)
        .json({ todo, message: 'Successfully completed todo!' });
    } catch (err) {
      return next(defaultError);
    }
  }

  public static async uncompleteTodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { username } = (<any>req).user;
    const { todoId } = req.params;
    const defaultError = createError({
      name: 'NotFoundError',
      message: `Cannot uncomplete, no todo whose ID is ${todoId} found!`,
    });

    try {
      const todo: ITodoDocument | any = await Todo.findOneAndUpdate(
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

      if (!todo) {
        throw createError({
          name: 'NotFoundError',
          message: `Cannot uncomplete, no todo whose ID is ${todoId} found!`,
        });
      }

      return res
        .status(200)
        .json({ todo, message: 'Successfully uncompleted todo!' });
    } catch (err) {
      return next(defaultError);
    }
  }

  public static async deleteTodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { username } = (<any>req).user;
      const { todoId } = req.params;
      const todo: ITodoDocument | any = await Todo.findOneAndDelete({
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
          message: `Cannot delete, no todo whose ID is ${todoId} found!`,
        });
      }

      return res
        .status(200)
        .json({ todo, message: 'Successfully deleted todo!' });
    } catch (err) {
      return next(err);
    }
  }
}

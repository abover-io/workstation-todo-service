import { Request, Response, NextFunction } from 'express';
import { Types, QueryOptions, MongooseFilterQuery } from 'mongoose';
import createError from 'http-errors';

// Types
import { ISubtodoDocument, ISubtodo } from '@/types/subtodo';

// Models
import { Subtodo } from '@/models';

const { ObjectId } = Types;

export default class SubtodoController {
  public static async getAllSubtodos(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const options: QueryOptions = {
        limit: 100,
        skip: 0,
      };

      const todoId: string | any = req.query.todoId;

      if (!todoId || !ObjectId.isValid(todoId)) {
        throw createError(400, 'Invalid todo ID!');
      }

      const conditions: MongooseFilterQuery<
        Pick<ISubtodoDocument, keyof ISubtodoDocument>
      > = {
        todoId: ObjectId(todoId),
      };

      const [subtodos, total] = await Promise.all([
        Subtodo.find(conditions, null, options),
        Subtodo.countDocuments(conditions),
      ]);

      return res.status(200).json({
        total,
        subtodos,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async createSubtodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { name, todoId }: ISubtodo = <ISubtodo>req.body;

      if (!name) {
        throw createError(400, 'Subtodo name cannot be empty!');
      }

      if (!todoId || !ObjectId.isValid(todoId)) {
        throw createError(400, 'Invalid todo ID!');
      }

      const createdSubtodo: ISubtodoDocument = await Subtodo.create({
        name,
        todoId: ObjectId(todoId + ''),
      });

      return res.status(201).json({ subtodo: createdSubtodo });
    } catch (err) {
      return next(err);
    }
  }

  public static async updateSubtodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const subtodoId: string | any =
        req.params.subtodoId || req.query.subtodoId;

      if (!subtodoId || !ObjectId.isValid(subtodoId)) {
        throw createError(400, 'Invalid subtodo ID!');
      }

      const { name, todoId }: ISubtodoDocument = <ISubtodoDocument>req.body;

      if (!name) {
        throw createError(400, 'Subtodo name cannot be empty!');
      }

      if (!todoId || !ObjectId.isValid(todoId)) {
        throw createError(400, 'Invalid todo ID!');
      }

      const updatedSubtodo: ISubtodoDocument | null = await Subtodo.findOneAndUpdate(
        {
          _id: ObjectId(subtodoId),
        },
        {
          name,
          todoId: ObjectId(todoId + ''),
        },
        { new: true },
      );

      if (!updatedSubtodo) {
        throw createError(404, `Subtodo with ID ${subtodoId} is not found!`);
      }

      return res.status(200).json({ subtodo: updatedSubtodo });
    } catch (err) {
      return next(err);
    }
  }

  public static async completeSubtodo(
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
      const todo: ISubtodoDocument | null = await Subtodo.findOneAndUpdate(
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

  public static async uncompleteSubtodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { username } = (<any>req).user;
    const { todoId } = req.params;
    const defaultError = createError({
      name: 'NotFoundError',
      message: `Cannot uncomplete, no subtodo with ID ${todoId}`,
    });

    try {
      const todo: ISubtodoDocument | null = await Subtodo.findOneAndUpdate(
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
        .json({ todo, message: 'Successfully uncompleted subtodo!' });
    } catch (err) {
      return next(defaultError);
    }
  }

  public static async deleteSubtodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { username } = (<any>req).user;
      const { todoId } = req.params;
      const todo: ISubtodoDocument | any = await Subtodo.findOneAndDelete({
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

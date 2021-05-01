import createError from 'http-errors';
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Types
import { ICustomRequest } from '@/types';
import { IUser } from '@/types/user';
import { IListDocument } from '@/types/list';
import { ITodoDocument } from '@/types/todo';
import { ISubtodoDocument } from '@/types/subtodo';

// Models
import { User, List, Todo, Subtodo } from '@/models';

export default class Authorize {
  static async User(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = (<ICustomRequest>req).user;

      const foundUser: IUser | null = await User.findOne({ email });

      if (!foundUser) {
        throw createError(404, `User with email ${email} is not found!`);
      } else if (foundUser.email !== email) {
        throw createError(401, 'You are not authorized!');
      }

      return next();
    } catch (err) {
      next(err);
    }
  }

  static async List(req: Request, res: Response, next: NextFunction) {
    try {
      const { email }: IUser = (<ICustomRequest>req).user;
      const _id: string | any =
        req.params.listId || req.body._id || req.query.listId;

      const foundList: IListDocument | null = await List.findOne({
        _id: Types.ObjectId(_id),
      });

      if (!foundList) {
        throw createError(404, `Todo with ID ${_id} is not found!`);
      } else if (foundList.email !== email) {
        throw createError(401, `You are not authorized!`);
      }

      return next();
    } catch (err) {
      return next(err);
    }
  }

  static async Todo(req: Request, res: Response, next: NextFunction) {
    try {
      const { email }: IUser = (<ICustomRequest>req).user;
      const _id: string | any =
        req.params.todoId || req.body._id || req.query.todoId;

      const foundLists: IListDocument[] = await List.find({
        email,
      });

      const listIds: Types.ObjectId[] = foundLists.map((list) => list._id);

      const foundTodo: ITodoDocument | null = await Todo.findOne({
        _id: Types.ObjectId(_id),
      });

      if (!foundTodo) {
        throw createError(404, `Todo with ID ${_id} is not found!`);
      } else if (!listIds.includes(foundTodo._id)) {
        throw createError(401, `You are not authorized!`);
      }

      return next();
    } catch (err) {
      return next(err);
    }
  }

  static async Subtodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any> | any> {
    try {
      const { email }: IUser = (<ICustomRequest>req).user;
      const _id: string | any =
        req.params.subtodoId || req.body._id || req.query.subtodoId;

      const foundLists: IListDocument[] = await List.find({
        email,
      });

      const foundTodos: ITodoDocument[] = await Todo.find({
        listId: {
          $in: foundLists.map((list) => list._id),
        },
      });

      const todoIds: Types.ObjectId[] = foundTodos.map((todo) => todo._id);

      const foundSubtodo: ISubtodoDocument | null = await Subtodo.findOne({
        _id: Types.ObjectId(_id),
      });

      if (!foundSubtodo) {
        throw createError(404, `Subtodo with ID ${_id} is not found!`);
      } else if (!todoIds.includes(foundSubtodo._id)) {
        throw createError(401, 'You are not authorized!');
      }

      return next();
    } catch (err) {
      return next(err);
    }
  }
}

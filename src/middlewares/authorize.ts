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
  static async User(req: Request, _: Response, next: NextFunction) {
    try {
      const { _id } = (<ICustomRequest>req).user;

      const foundUser: IUser | null = await User.findOne({ _id });

      if (!foundUser) {
        throw createError(404, `User with ID ${_id} is not found!`);
      } else if (!foundUser._id!.equals(_id!)) {
        throw createError(401, 'You are not authorized!');
      }

      return next();
    } catch (err) {
      next(err);
    }
  }

  static async List(req: Request, _: Response, next: NextFunction) {
    try {
      const { _id: userId }: IUser = (<ICustomRequest>req).user;
      const _id: string | any =
        req.params.listId || req.body._id || req.query.listId;

      const foundList: IListDocument | null = await List.findOne({
        _id: Types.ObjectId(_id),
      });

      if (!foundList) {
        throw createError(404, `List with ID ${_id} is not found!`);
      } else if (!foundList.userId.equals(userId!)) {
        throw createError(401, `You are not authorized!`);
      }

      return next();
    } catch (err) {
      return next(err);
    }
  }

  static async Todo(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id: userId }: IUser = (<ICustomRequest>req).user;
      const todoId: string | any =
        req.params.todoId || req.body._id || req.query.todoId;

      const foundTodo: ITodoDocument | null = await Todo.findOne({
        $and: [
          {
            _id: Types.ObjectId(todoId),
          },
          {
            userId,
          },
        ],
      });

      if (!foundTodo) {
        throw createError(404, `Todo with ID ${todoId} is not found!`);
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

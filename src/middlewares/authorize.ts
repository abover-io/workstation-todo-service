import createError from 'http-errors';
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { verify as verifyJWT } from 'jsonwebtoken';

// Types
import { ICustomRequest } from '@/types';
import { IUser } from '@/types/user';
import { IListDocument } from '@/types/list';
import { ITodoDocument } from '@/types/todo';
import { ISubtodoDocument } from '@/types/subtodo';

// Models
import { User, List, Todo, Subtodo } from '@/models';

// Config
import { JWT_ACCESS_SECRET } from '@/config';

export default class Authorize {
  static async authorizeUser(req: Request, res: Response, next: NextFunction) {
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

  static async authorizeTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { email }: IUser = (<ICustomRequest>req).user;
      const listId: string | any = req.query.listId;
      const todoId: string | any = req.params.todoId || req.query.todoId;

      const foundList: IListDocument | null = await List.findOne({
        $and: [
          {
            _id: Types.ObjectId(listId),
          },
          {
            email,
          },
        ],
      });

      if (!foundList) {
        throw createError(404, `List with ID ${listId} is not found!`);
      }

      const foundTodo: ITodoDocument | null = await Todo.findOne({
        $and: [
          {
            _id: Types.ObjectId(todoId),
          },
          {
            listId: Types.ObjectId(listId),
          },
        ],
      });

      if (!foundTodo) {
        throw createError(404, `Todo with ID ${todoId} is not found!`);
      } else if (!foundTodo.listId.equals(Types.ObjectId(listId))) {
        throw createError(401, `You are not authorized!`);
      } else {
        return next();
      }
    } catch (err) {
      if (
        err.message ==
        'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
      ) {
        return next();
      } else {
        return next(err);
      }
    }
  }

  static async authorizeSubtodo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any> | any> {
    try {
      const { email }: IUser = (<ICustomRequest>req).user;
      const listId: string | any = req.query.listId;
      const todoId: string | any = req.query.todoId;
      const subtodoId: string | any =
        req.params.subtodoId || req.query.subtodoId;

      const foundList: IListDocument | null = await List.findOne({
        $and: [
          {
            _id: Types.ObjectId(listId),
          },
          {
            email,
          },
        ],
      });

      if (!foundList) {
        throw createError(404, `List with ID ${listId} is not found!`);
      }

      const foundTodo: ITodoDocument | null = await Todo.findOne({
        $and: [
          {
            _id: Types.ObjectId(todoId),
          },
          {
            listId: foundList._id,
          },
        ],
      });

      if (!foundTodo) {
        throw createError(404, `Todo with ID ${todoId} is not found!`);
      }

      const foundSubtodo: ISubtodoDocument | null = await Subtodo.findOne({
        $and: [
          {
            _id: Types.ObjectId(subtodoId),
          },
          {
            todoId: Types.ObjectId(todoId),
          },
        ],
      });

      if (!foundSubtodo) {
        throw createError(404, `Subtodo with ID ${subtodoId} is not found!`);
      } else if (!foundSubtodo.todoId.equals(Types.ObjectId(todoId))) {
        throw createError(401, 'You are not authorized!');
      } else {
        return next();
      }
    } catch (err) {
      return next(err);
    }
  }
}

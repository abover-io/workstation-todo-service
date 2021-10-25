import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

// Types
import { ICustomRequest } from '@/types';
import { IUserDocument } from '@/types/user';
import { ISocialDocument } from '@/types/social';
import { IListDocument } from '@/types/list';
import { ITodoDocument } from '@/types/todo';
import { ISubtodoDocument } from '@/types/subtodo';

// Models
import { User, Social, List, Todo, Subtodo } from '@/models';

export default class UserController {
  public static async UpdateName(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const { email } = (<ICustomRequest>req).user;

      const updatedUser: IUserDocument | null = await User.findOneAndUpdate(
        {
          email,
        },
        {
          name: req.body.name,
        },
        {
          new: true,
          projection: {
            __v: 0,
            password: 0,
          },
        },
      );

      if (!updatedUser) {
        throw createError(404, {
          message: 'User not found',
        });
      }

      return res.status(200).json({
        message: 'Updated user password!',
        user: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async UpdateEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const { email } = (<ICustomRequest>req).user;

      const updatedUser = await User.updateOne(
        {
          email,
        },
        {
          email: req.body.email,
        },
        {
          new: true,
          projection: {
            __v: 0,
            password: 0,
          },
        },
      );

      if (!updatedUser) {
        throw createError(404, {
          message: 'User not found',
        });
      }

      return res.status(200).json({
        message: 'Updated user password!',
        user: updatedUser,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async UpdatePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const { email } = (<ICustomRequest>req).user;

      const updatedUser: IUserDocument | null = await User.findOneAndUpdate(
        {
          email,
        },
        {
          password: req.body.password,
        },
        {
          projection: {
            __v: 0,
            password: 0,
          },
        },
      );

      if (!updatedUser) {
        throw createError(404, {
          message: 'User not found',
        });
      }

      return res.status(200).json({
        message: 'Updated user password!',
        user: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async DeleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const { email } = (<ICustomRequest>req).user;

      const deletedUser: IUserDocument | null = await User.findOne(
        {
          email,
        },
        {
          projection: {
            __v: 0,
            password: 0,
          },
        },
      );

      if (!deletedUser) {
        throw createError(404, {
          message: 'User not found',
        });
      }

      const deletedSocial: ISocialDocument | null = await Social.findOne({
        userId: deletedUser._id,
      });

      const deletedLists: IListDocument[] = await List.find({
        email,
      });

      const deletedTodos: ITodoDocument[] = await Todo.find({
        listId: {
          $in: deletedLists.map((list) => list._id),
        },
      });

      const deletedSubtodos: ISubtodoDocument[] = await Subtodo.find({
        todoId: {
          $in: deletedTodos.map((todo) => todo._id),
        },
      });

      // Delete Process
      await Promise.all([
        Subtodo.deleteMany({
          _id: {
            $in: deletedSubtodos.map((subtodo) => subtodo._id),
          },
        }),
        Todo.deleteMany({
          _id: {
            $in: deletedTodos.map((todo) => todo._id),
          },
        }),
        List.deleteMany({
          _id: {
            $in: deletedLists.map((list) => list._id),
          },
        }),
        Social.deleteOne({
          _id: deletedSocial?._id,
        }),
        User.deleteOne({
          $and: [
            {
              _id: deletedUser._id,
            },
            {
              email,
            },
          ],
        }),
      ]);

      res.clearCookie('act', { path: '/' });
      res.clearCookie('rft', { path: '/' });
      res.clearCookie('_xsrf', { path: '/' });

      return res.status(200).json({
        message: 'Successfully deleted user!',
      });
    } catch (err) {
      return next(err);
    }
  }
}

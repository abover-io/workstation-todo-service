import { Request, Response, NextFunction } from 'express';
import { Types, QueryOptions, MongooseFilterQuery } from 'mongoose';
import createError from 'http-errors';

// Typings
import { ICustomRequest } from '@/types';
import { IListDocument, IList } from '@/types/list';

// Models
import { List } from '@/models';

const { ObjectId } = Types;

export default class ListController {
  public static async getAllLists(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { username } = (<ICustomRequest>req).user!;

      const options: QueryOptions = {
        limit: 100,
        skip: 0,
      };

      const conditions: MongooseFilterQuery<
        Pick<IListDocument, keyof IListDocument>
      > = {
        username,
      };

      const getAllListsPipeline: any[] = [];

      const [lists, total] = await Promise.all([
        List.aggregate(getAllListsPipeline),
        List.countDocuments(conditions),
      ]);

      return res.status(200).json({
        total,
        lists,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async createList(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { username } = (<ICustomRequest>req).user!;
      const { name, color }: IList = <IList>req.body;

      const createdList: IListDocument = await List.create({
        username,
        name,
        color,
      });

      return res.status(201).json({ list: createdList });
    } catch (err) {
      return next(err);
    }
  }

  public static async updateList(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { username } = (<ICustomRequest>req).user!;
      const listId: string | any = req.params.listId || req.query.listId;
      const { name, color }: IList = <IList>req.body;

      if (!listId || !ObjectId.isValid(listId)) {
        throw createError(400, 'Invalid list ID!');
      }

      const updatedList: IListDocument | null = await List.findOneAndUpdate(
        {
          $and: [
            {
              _id: ObjectId(listId),
            },
            {
              username,
            },
          ],
        },
        {
          name,
          color,
        },
        { new: true },
      );

      if (!updatedList) {
        throw createError(404, `List with ID ${listId} is not found!`);
      }

      return res.status(200).json({ list: updatedList });
    } catch (err) {
      return next(err);
    }
  }

  public static async deleteList(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { username } = (<ICustomRequest>req).user!;
      const listId: string | any = req.params.listId || req.query.listId;

      const deletedList: IListDocument | null = await List.findOneAndDelete({
        $and: [
          {
            _id: ObjectId(listId),
          },
          {
            username,
          },
        ],
      });

      if (!deletedList) {
        throw createError(404, `List with ID ${listId} is not found!`);
      }

      return res.status(200).json({ list: deletedList });
    } catch (err) {
      return next(err);
    }
  }
}

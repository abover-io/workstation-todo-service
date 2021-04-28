import { Request, Response, NextFunction } from 'express';
import { Types, QueryOptions, MongooseFilterQuery } from 'mongoose';
import createError from 'http-errors';

// Typings
import { ICustomRequest } from '@/types';
import { IListDocument, IList } from '@/types/list';

// Models
import { List, Todo, Subtodo } from '@/models';

const { ObjectId } = Types;

export default class ListController {
  public static async getAllLists(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { email } = (<ICustomRequest>req).user;

      const options: QueryOptions = {
        limit: 100,
        skip: 0,
        sort: {
          _id: 1,
        },
      };

      const conditions: MongooseFilterQuery<
        Pick<IListDocument, keyof IListDocument>
      > = {
        email,
      };

      const getAllListsPipeline: any[] = [
        {
          $match: {
            email,
          },
        },
        {
          $skip: options.skip,
        },
        {
          $limit: options.limit,
        },
        {
          $lookup: {
            from: Todo.collection.name,
            let: {
              listId: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$listId', '$$listId'],
                  },
                },
              },
              {
                $count: 'total',
              },
            ],
            as: 'todos',
          },
        },
        {
          $sort: options.sort,
        },
      ];

      const lists = await List.aggregate(getAllListsPipeline);

      return res.status(200).json({
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
      const { email } = (<ICustomRequest>req).user;
      const { name, color }: IList = <IList>req.body;

      const createdList: IListDocument = await List.create({
        email,
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
      const { email } = (<ICustomRequest>req).user;
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
              email,
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
      const { email } = (<ICustomRequest>req).user!;
      const listId: string | any = req.params.listId || req.query.listId;

      const deletedList: IListDocument | null = await List.findOneAndDelete({
        $and: [
          {
            _id: ObjectId(listId),
          },
          {
            email,
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

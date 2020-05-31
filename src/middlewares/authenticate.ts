import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import createError from "http-errors";

import User, { IUserModel } from "@/models/user";
import { JWT_ACCESS_SECRET } from '@/config';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken: string | any =
      req.headers["x-access-token"] ||
      req.headers["X-ACCESS-TOKEN"] ||
      req.headers.authorization?.split(" ")[1] ||
      req.cookies.accessToken ||
      req.body.accessToken;

    if (!accessToken) {
      throw createError({
        name: "AuthorizationError",
        message: "No access token provided."
      });
    }

    const user: IUserModel | any = verify(accessToken, JWT_ACCESS_SECRET);

    if (user) {
      const foundUser: IUserModel | any = await User.findOne({
        $or: [
          {
            username: user.username
          },
          {
            email: user.email
          }
        ]
      });

      if (!foundUser) {
        throw createError({
          name: "AuthorizationError",
          message: "Not Authorized."
        });
      } else {
        (<any>req)["user"] = user;
        next();
      }
    }
  } catch (err) {
    next(err);
  }
};

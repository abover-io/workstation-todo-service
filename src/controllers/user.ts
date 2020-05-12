import { compareSync, hashSync } from "bcryptjs";
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import User, { IUserModel } from "../models/user";
import generateUserTokens from "../helpers/generateUserTokens";
import handleRefreshToken from "../helpers/handleRefreshToken";
import decideCookieOptions from "../helpers/decideCookieOptions";

export default class UserController {
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const newTokens = await handleRefreshToken(refreshToken);
      res.cookie("accessToken", newTokens.accessToken, {
        httpOnly: decideCookieOptions("httpOnly"),
        // secure: decideCookieOptions("secure"),
        path: "/"
      });
      res.cookie("refreshToken", newTokens.refreshToken, {
        httpOnly: decideCookieOptions("httpOnly"),
        // secure: decideCookieOptions("secure"),
        path: "/"
      });
      res.status(200).json({ tokens: newTokens, message: "Successfully refreshed token!" });
    } catch (err) {
      if (err.name == "RefreshTokenError") {
        next(
          createError({
            name: "AuthorizationError",
            message: err.message
          })
        );
      } else {
        next(err);
      }
    }
  }

  static async signUp(req: any, res: any, next: any) {
    try {
      const { firstName, lastName = "", username, email, password } = req.body;
      await User.create({
        firstName,
        lastName,
        username,
        email,
        password
      });
      const signedUpUser = await User.findOne({ username });
      res.status(201).json({
        user: {
          _id: signedUpUser?._id,
          firstName,
          lastName,
          username,
          email
        },
        message: "Successfully signed up!"
      });
    } catch (err) {
      next(err);
    }
  }

  static async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { userIdentifier, password } = req.body;
      const signInUser: any = await User.findOne({
        $or: [
          {
            username: userIdentifier
          },
          {
            email: userIdentifier
          }
        ]
      });
      if (!signInUser) {
        throw createError({
          name: "NotFoundError",
          message: "User not found, please sign up first!"
        });
      } else {
        const { firstName, lastName, username, email } = signInUser;
        const tokens = await generateUserTokens({
          firstName,
          lastName,
          username,
          email
        });
        if (compareSync(password, signInUser.password)) {
          res.cookie("accessToken", tokens.accessToken, {
            httpOnly: decideCookieOptions("httpOnly"),
            // secure: decideCookieOptions("secure"),
            path: "/"
          });
          res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: decideCookieOptions("httpOnly"),
            // secure: decideCookieOptions("secure"),
            path: "/"
          })
          res.status(200).json({
            user: {
              firstName,
              lastName,
              username,
              email
            },
            message: `Welcome, ${firstName}`,
            tokens
          });
        } else {
          throw createError({
            name: "BadRequestError",
            message: "Wrong username or password!"
          });
        }
      }
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: any, res: any, next: any) {
    try {
      const oldUsername = req.params.username;
      const { firstName, lastName = "", email } = req.body;
      const newUsername = req.body.username;
      await User.updateOne(
        { username: oldUsername },
        { firstName, lastName, username: newUsername, email }
      );
      const tokens = await generateUserTokens({
        firstName,
        lastName,
        username: newUsername,
        email
      });
      res.cookie("accessToken", tokens.accessToken, {
        httpOnly: decideCookieOptions("httpOnly"),
        // secure: decideCookieOptions("secure"),
        path: "/"
      });
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: decideCookieOptions("httpOnly"),
        // secure: decideCookieOptions("secure"),
        path: "/"
      });
      res.status(200).json({
        user: {
          firstName,
          lastName,
          username: newUsername,
          email
        },
        message: "Successfully updated user!"
      });
    } catch (err) {
      next(err);
    }
  }

  static async updatePassword(req: any, res: any, next: any) {
    try {
      const { username } = req.params;
      const { password } = req.body;
      const hashedPassword = hashSync(password, 10);
      await User.updateOne({ username }, { password: hashedPassword });
      res.status(200).json({
        message: "Successfully updated password!"
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: any, res: any, next: any) {
    try {
      const { username } = req.params;
      await User.deleteOne({
        username
      });
      res.clearCookie("refreshToken", { path: "/" });
      res.clearCookie("accessToken", { path: "/" });
      res.status(200).json({
        message: "Successfully deleted account!"
      });
    } catch (err) {
      next(err);
    }
  }

  static async signOut(req: Request, res: Response, next: NextFunction) {
    const user: IUserModel = (<any>req)["user"];
    const receivedRefreshToken: string =
      req.cookies.refreshToken ||
      req.headers.refreshToken ||
      req.headers["X-REFRESH-TOKEN"] ||
      req.headers["x-refresh-token"] ||
      req.body.refreshToken;

    try {
      const foundUser: IUserModel | any = await User.findOne({
        username: user.username
      });

      if (!receivedRefreshToken) {
        res.clearCookie("refreshToken", { path: "/" });
        res.clearCookie("accessToken", { path: "/" });
        return res.status(200).json({ message: "Successfully signed out!" });
      }

      const updatedRefreshTokens: Array<string> = foundUser.refreshTokens.filter(
        (refreshToken: string) => {
          return refreshToken != receivedRefreshToken;
        }
      );

      await User.updateOne({ username: user.username }, { refreshTokens: updatedRefreshTokens });

      res.clearCookie("refreshToken", { path: "/" });
      res.clearCookie("accessToken", { path: "/" });
      return res.status(200).json({ message: "Successfully signed out!" });
    } catch (err) {
      next(err);
    }
  }
}

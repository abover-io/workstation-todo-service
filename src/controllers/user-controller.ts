import { compareSync, hashSync } from 'bcryptjs';
import createError, { HttpError } from 'http-errors';
import { Request, Response, NextFunction } from 'express';

import { IUser, ISignUpValidations, CustomHttpError, ISignInValidations } from '@/types';
import { User, Todo } from '@/models';
import {
  generateUserTokens,
  handleRefreshToken,
  decideCookieOptions,
  CustomValidator,
  createToken
} from '@/utils';

export default class UserController {
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const newTokens = await handleRefreshToken(refreshToken);
      res.cookie('accessToken', newTokens.accessToken, {
        httpOnly: decideCookieOptions('httpOnly'),
        // secure: decideCookieOptions("secure"),
        path: '/',
      });
      res.cookie('refreshToken', newTokens.refreshToken, {
        httpOnly: decideCookieOptions('httpOnly'),
        // secure: decideCookieOptions("secure"),
        path: '/',
      });
      res
        .status(200)
        .json({ tokens: newTokens, message: 'Successfully refreshed token!' });
    } catch (err) {
      if (err.name == 'RefreshTokenError') {
        next(
          createError({
            name: 'AuthorizationError',
            message: err.message,
          })
        );
      } else {
        next(err);
      }
    }
  }

  static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName = '', username, email, password } = req.body;
      const errorMessages: HttpError[] = [];
      const validations: ISignUpValidations = {
        firstName: CustomValidator.firstName(firstName),
        username: CustomValidator.username(username),
        email: CustomValidator.email(email),
        password: CustomValidator.password(password)
      };

      for (const validationKey in validations) {
        if (validations[validationKey]) {
          const currentError: HttpError = {
            expose: false,
            message: validations[validationKey],
            statusCode: 400,
            status: 400,
            name: validationKey
          };
          errorMessages.push(currentError);
        }
      }

      if (errorMessages.length) {
        const httpErrorWithMultipleMessages: CustomHttpError = {
          expose: false,
          message: 'Failed to sign up, please correct user information!',
          messages: errorMessages,
          statusCode: 400,
          status: 400,
          name: 'ValidationError'
        };

        throw httpErrorWithMultipleMessages;
      }

      const existedUser: IUser | any = await User.findOne({
        $or: [
          {
            username,
          },
          {
            email,
          },
        ],
      });

      if (existedUser) {
        if (existedUser.username == username) {
          throw createError({
            name: 'AlreadyExistsError',
            message: `Username isn't available.`,
            expose: false
          });
        } else if (existedUser.email == email) {
          throw createError({
            name: 'AlreadyExistsError',
            message: `Email isn't available.`,
            expose: false
          });
        }
      } else {
        const newUserTokens = await generateUserTokens({ firstName, lastName, username, email }, 'signUp');
        const newApiKey = createToken('apiKey', { username, email });

        await User.create({
          firstName,
          lastName,
          username,
          email,
          password,
          refreshTokens: [newUserTokens.refreshToken],
          apiKey: newApiKey
        });

        res.cookie('act', newUserTokens.accessToken, {
          httpOnly: true,
          // secure: decideCookieOptions('secure'),
          path: '/',
          signed: true
        });

        res.cookie('rft', newUserTokens.refreshToken, {
          httpOnly: true,
          // secure: decideCookieOptions('secure'),
          path: '/',
          signed: true
        });

        res.cookie('XSRF-TOKEN', req.csrfToken())

        return res.status(201).json({
          user: {
            firstName,
            lastName,
            username,
            email,
            apiKey: newApiKey
          },
          tokens: newUserTokens,
          message: 'Successfully signed up!',
        });
      }
    } catch (err) {
      return next(err);
    }
  }

  static async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { userIdentifier, password } = req.body;
      const errorMessages: HttpError[] = [];
      const validations: ISignInValidations = {
        userIdentifier: CustomValidator.userIdentifier(userIdentifier),
        password: CustomValidator.password(password)
      };

      for (const validationKey in validations) {
        if (validations[validationKey]) {
          const currentError: HttpError = {
            expose: false,
            message: validations[validationKey],
            statusCode: 400,
            status: 400,
            name: validationKey
          };
          errorMessages.push(currentError);
        }
      }

      if (errorMessages.length) {
        const httpErrorWithMultipleMessages: CustomHttpError = {
          expose: false,
          message: 'Failed to sign in, please correct user information!',
          messages: errorMessages,
          statusCode: 400,
          status: 400,
          name: 'ValidationError'
        };

        throw httpErrorWithMultipleMessages;
      }

      const signInUser: any = await User.findOne({
        $or: [
          {
            username: userIdentifier,
          },
          {
            email: userIdentifier,
          },
        ],
      });

      if (!signInUser) {
        throw createError({
          name: 'NotFoundError',
          message: 'User not found, please sign up first!',
          expose: false
        });
      } else {
        const { firstName, lastName, username, email, apiKey } = signInUser;
        const tokens = await generateUserTokens({
          firstName,
          lastName,
          username,
          email,
        });
        if (compareSync(password, signInUser.password)) {
          res.cookie('act', tokens.accessToken, {
            httpOnly: true,
            // secure: decideCookieOptions('secure'),
            path: '/',
          });
          res.cookie('rft', tokens.refreshToken, {
            httpOnly: true,
            // secure: decideCookieOptions('secure'),
            path: '/',
          });

          res.cookie('XSRF-TOKEN', req.csrfToken());

          res.status(200).json({
            user: {
              firstName,
              lastName,
              username,
              email,
              apiKey
            },
            message: 'Successfully signed in!',
            tokens,
          });
        } else {
          throw createError({
            name: 'BadRequestError',
            message: 'Wrong username or password!',
            expose: false
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
      const { firstName, lastName = '', email } = req.body;
      const newUsername = req.body.username;
      await User.updateOne(
        { username: oldUsername },
        { firstName, lastName, username: newUsername, email }
      );
      const tokens = await generateUserTokens({
        firstName,
        lastName,
        username: newUsername,
        email,
      });
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: decideCookieOptions('httpOnly'),
        // secure: decideCookieOptions("secure"),
        path: '/',
      });
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: decideCookieOptions('httpOnly'),
        // secure: decideCookieOptions("secure"),
        path: '/',
      });
      res.status(200).json({
        user: {
          firstName,
          lastName,
          username: newUsername,
          email,
        },
        message: 'Successfully updated user!',
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
        message: 'Successfully updated password!',
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req: any, res: any, next: any) {
    try {
      const { username } = req.params;
      await User.deleteOne({
        username,
      });
      res.clearCookie('refreshToken', { path: '/' });
      res.clearCookie('accessToken', { path: '/' });
      res.status(200).json({
        message: 'Successfully deleted account!',
      });
    } catch (err) {
      next(err);
    }
  }

  static async signOut(req: Request, res: Response, next: NextFunction) {
    const user: IUser = (<any>req)['user'];
    const receivedRefreshToken: string =
      req.cookies.refreshToken ||
      req.headers.refreshToken ||
      req.headers['X-REFRESH-TOKEN'] ||
      req.headers['x-refresh-token'] ||
      req.body.refreshToken;

    try {
      const foundUser: IUser | any = await User.findOne({
        username: user.username,
      });

      if (!receivedRefreshToken) {
        res.clearCookie('refreshToken', { path: '/' });
        res.clearCookie('accessToken', { path: '/' });
        return res.status(200).json({ message: 'Successfully signed out!' });
      }

      const updatedRefreshTokens: Array<string> = foundUser.refreshTokens.filter(
        (refreshToken: string) => {
          return refreshToken != receivedRefreshToken;
        }
      );

      await User.updateOne(
        { username: user.username },
        { refreshTokens: updatedRefreshTokens }
      );

      res.clearCookie('refreshToken', { path: '/' });
      res.clearCookie('accessToken', { path: '/' });
      return res.status(200).json({ message: 'Successfully signed out!' });
    } catch (err) {
      next(err);
    }
  }

  static async sync(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, username }: IUser = (<any>req)['user'];
      const foundUser: IUser | any = await User.findOne({
        $or: [
          {
            email,
          },
          {
            username,
          },
        ],
      });
      const todos = (await Todo.find({ username })) || [];
      res.status(200).json({
        user: {
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          username,
          email,
        },
        todos,
        message: 'Successfully synced!',
      });
    } catch (err) {
      next(err);
    }
  }
}

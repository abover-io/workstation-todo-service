import { compareSync, hashSync } from 'bcryptjs';
import createError, { HttpError } from 'http-errors';
import { Request, Response, NextFunction } from 'express';

import {
  IUser,
  ISignUpValidations,
  CustomHttpError,
  ISignInValidations,
  IUpdateUserValidations,
  ITodo,
} from '@/types';
import { User, Todo } from '@/models';
import {
  generateUserTokens,
  handleRefreshToken,
  decideCookieOptions,
  CustomValidator,
  createToken,
} from '@/utils';

export default class UserController {
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { rft } = req.cookies;
      const newTokens = await handleRefreshToken(rft);
      res.cookie('act', newTokens.accessToken, {
        httpOnly: decideCookieOptions('httpOnly'),
        // secure: decideCookieOptions('secure'),
        path: '/',
      });
      res.cookie('rft', newTokens.refreshToken, {
        httpOnly: decideCookieOptions('httpOnly'),
        // secure: decideCookieOptions('secure'),
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
        password: CustomValidator.password(password),
      };

      for (const validationKey in validations) {
        if (validations[validationKey]) {
          const currentError: HttpError = {
            expose: false,
            message: validations[validationKey],
            statusCode: 400,
            status: 400,
            name: validationKey,
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
          name: 'ValidationError',
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
            expose: false,
          });
        } else if (existedUser.email == email) {
          throw createError({
            name: 'AlreadyExistsError',
            message: `Email isn't available.`,
            expose: false,
          });
        }
      } else {
        const newUserTokens = await generateUserTokens(
          { firstName, lastName, username, email },
          'signUp'
        );
        const newApiKey = createToken('apiKey', { username, email });

        await User.create({
          firstName,
          lastName,
          username,
          email,
          password,
          refreshTokens: [newUserTokens.refreshToken],
          apiKey: newApiKey,
        });

        res.cookie('act', newUserTokens.accessToken, {
          httpOnly: true,
          // secure: decideCookieOptions('secure'),
          path: '/',
          signed: true,
        });

        res.cookie('rft', newUserTokens.refreshToken, {
          httpOnly: true,
          // secure: decideCookieOptions('secure'),
          path: '/',
          signed: true,
        });

        res.cookie('XSRF-TOKEN', req.csrfToken());

        res.status(201).json({
          user: {
            firstName,
            lastName,
            username,
            email,
            apiKey: newApiKey,
          },
          tokens: {
            ...newUserTokens,
            csrfToken: req.csrfToken()
          },
          message: 'Successfully signed up!',
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { userIdentifier, password } = req.body;
      const errorMessages: HttpError[] = [];
      const validations: ISignInValidations = {
        userIdentifier: CustomValidator.userIdentifier(userIdentifier),
        password: CustomValidator.password(password),
      };

      for (const validationKey in validations) {
        if (validations[validationKey]) {
          const currentError: HttpError = {
            expose: false,
            message: validations[validationKey],
            statusCode: 400,
            status: 400,
            name: validationKey,
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
          name: 'ValidationError',
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
          expose: false,
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
              apiKey,
            },
            message: 'Successfully signed in!',
            tokens: {
              ...tokens,
              csrfToken: req.csrfToken()
            },
          });
        } else {
          throw createError({
            name: 'BadRequestError',
            message: 'Wrong username or password!',
            expose: false,
          });
        }
      }
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username: usernameFromAuth } = (<any>req).user;
      const { username: usernameFromParams } = req.params;
      const { firstName, lastName = '', email } = req.body;
      const validations: IUpdateUserValidations = {
        firstName: CustomValidator.firstName(firstName),
        email: CustomValidator.email(email),
      };
      const validationErrors: HttpError[] = [];

      if (usernameFromAuth != usernameFromParams) {
        const usernameAuthError: HttpError = {
          expose: false,
          name: 'AuthorizationError',
          status: 401,
          statusCode: 401,
          message: 'Cannot update user, invalid credentials!',
        };
        throw usernameAuthError;
      }

      for (const validationKey in validations) {
        if (validations[validationKey]) {
          const currentValidationError: HttpError = {
            expose: false,
            status: 400,
            statusCode: 400,
            name: validationKey,
            message: validations[validationKey],
          };
          validationErrors.push(currentValidationError);
        }
      }

      if (validationErrors.length) {
        const httpErrorWithMultipleMessages: CustomHttpError = {
          expose: false,
          message: 'Cannot update, please correct user information!',
          messages: validationErrors,
          statusCode: 400,
          status: 400,
          name: 'ValidationError',
        };
        throw httpErrorWithMultipleMessages;
      }

      const existedUser: IUser | any = await User.findOne({ email });

      if (existedUser) {
        throw createError({
          name: 'AlreadyExistsError',
          message: `Email isn't available.`,
          expose: false,
        });
      } else {
        await User.updateOne(
          { username: usernameFromAuth },
          { firstName, lastName, email }
        );
        const tokens = await generateUserTokens({
          firstName,
          lastName,
          username: usernameFromAuth,
          email,
        });
        res.cookie('act', tokens.accessToken, {
          httpOnly: decideCookieOptions('httpOnly'),
          // secure: decideCookieOptions('secure'),
          path: '/',
        });
        res.cookie('rft', tokens.refreshToken, {
          httpOnly: decideCookieOptions('httpOnly'),
          // secure: decideCookieOptions('secure'),
          path: '/',
        });
        res.status(200).json({
          user: {
            firstName,
            lastName,
            username: usernameFromAuth,
            email,
          },
          message: 'Successfully updated user!',
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { username: usernameFromAuth } = (<any>req).user;
      const { username: usernameFromParams } = req.params;
      const { password } = req.body;
      const passwordValidation = CustomValidator.password(password);

      if (usernameFromAuth != usernameFromParams) {
        const usernameAuthError: HttpError = {
          expose: false,
          name: 'AuthorizationError',
          status: 401,
          statusCode: 401,
          message: 'Cannot update user, invalid credentials!',
        };
        throw usernameAuthError;
      }

      if (passwordValidation?.length) {
        const passwordValidationError: HttpError = {
          expose: false,
          status: 400,
          statusCode: 400,
          name: 'ValidationError',
          message: passwordValidation,
        };
        throw passwordValidationError;
      }

      const hashedPassword = hashSync(password, 10);

      await User.updateOne(
        { username: usernameFromAuth },
        { password: hashedPassword }
      );

      res.status(200).json({
        message: 'Successfully updated password!',
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username: usernameFromAuth } = (<any>req).user;
      const { username: usernameFromParams } = req.params;

      if (usernameFromAuth != usernameFromParams) {
        const usernameAuthError: HttpError = {
          expose: false,
          name: 'AuthorizationError',
          status: 401,
          statusCode: 401,
          message: 'Cannot update user, invalid credentials!',
        };
        throw usernameAuthError;
      }

      await User.deleteOne({
        username: usernameFromAuth,
      });

      res.clearCookie('rft', { path: '/' });
      res.clearCookie('act', { path: '/' });

      return res.status(200).json({
        message: 'Successfully deleted account!',
      });
    } catch (err) {
      return next(err);
    }
  }

  static async signOut(req: Request, res: Response, next: NextFunction) {
    const { username } = (<any>req).user;
    const receivedRefreshToken: string =
      req.cookies.rft ||
      req.headers['X-RFT'] ||
      req.headers['x-rft'] ||
      req.body.rft;

    try {
      const foundUser: IUser | any = await User.findOne({
        username,
      });

      if (!receivedRefreshToken) {
        res.clearCookie('rft', { path: '/' });
        res.clearCookie('act', { path: '/' });
        return res.status(200).json({ message: 'Successfully signed out!' });
      }

      const updatedRefreshTokens: string[] = foundUser.refreshTokens.filter(
        (refreshToken: string) => refreshToken != receivedRefreshToken
      );

      await User.updateOne(
        { username },
        { refreshTokens: updatedRefreshTokens }
      );

      res.clearCookie('act', { path: '/' });
      res.clearCookie('rft', { path: '/' });
      return res.status(200).json({ message: 'Successfully signed out!' });
    } catch (err) {
      next(err);
    }
  }

  static async sync(req: Request, res: Response, next: NextFunction) {
    try {
      const { username }: IUser = (<any>req).user;
      const { firstName, lastName, email }: IUser | any = await User.findOne({
        username,
      });
      const todos: ITodo[] = await Todo.find({ username });
      res.status(200).json({
        user: {
          firstName,
          lastName,
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

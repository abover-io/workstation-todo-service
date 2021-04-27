import { hashSync } from 'bcryptjs';
import createError, { HttpError } from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Typings
import { CustomHttpError, IUpdateUserValidations } from '@/types';
import { IUserDocument } from '@/types/user';
import { ITodoDocument } from '@/types/todo';

// Config
import { JWT_REFRESH_SECRET } from '@/config';

// Models
import { User, Todo } from '@/models';

// Utils
import {
  generateUserTokens,
  decideCookieOptions,
  CustomValidator,
  createToken,
} from '@/utils';

export default class UserController {
  public static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const { username: usernameFromAuth } = (<any>req).user;
      const { username: usernameFromParams } = req.params;
      const { firstName, lastName = '', email } = req.body;
      const validations: IUpdateUserValidations = {
        name: CustomValidator.Name(firstName),
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

      const existedUser: IUserDocument | any = await User.findOne({ email });

      if (existedUser) {
        throw createError({
          name: 'AlreadyExistsError',
          message: `Email isn't available.`,
          expose: false,
        });
      } else {
        const updatedApiKey = createToken('apiKey', {
          username: usernameFromAuth,
          email,
        });

        const {
          isUsernameSet,
          isPasswordSet,
          verified,
        }: IUserDocument | any = await User.findOneAndUpdate(
          { username: usernameFromAuth },
          { firstName, lastName, email, apiKey: updatedApiKey },
          { new: true },
        );

        const tokens = await generateUserTokens({
          firstName,
          lastName,
          username: usernameFromAuth,
          email,
        });

        res.cookie('act', tokens.accessToken, {
          httpOnly: decideCookieOptions('httpOnly'),
          secure: decideCookieOptions('secure'),
          path: '/',
          signed: true,
          sameSite: decideCookieOptions('sameSite'),
        });

        res.cookie('rft', tokens.refreshToken, {
          httpOnly: decideCookieOptions('httpOnly'),
          secure: decideCookieOptions('secure'),
          path: '/',
          signed: true,
          sameSite: decideCookieOptions('sameSite'),
        });

        return res.status(200).json({
          user: {
            firstName,
            lastName,
            isUsernameSet,
            username: usernameFromAuth,
            email,
            isPasswordSet,
            verified,
            apiKey: updatedApiKey,
          },
          tokens: {
            ...tokens,
            csrfToken: req.csrfToken(),
          },
          message: 'Successfully updated user!',
        });
      }
    } catch (err) {
      return next(err);
    }
  }

  public static async updatePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
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
        { isPasswordSet: true, password: hashedPassword },
      );

      return res.status(200).json({
        message: 'Successfully updated password!',
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const { username: usernameFromAuth } = (<any>req).user;
      const { username: usernameFromParams } = req.params;

      if (usernameFromAuth != usernameFromParams) {
        const usernameAuthError: HttpError = {
          expose: false,
          name: 'AuthorizationError',
          status: 401,
          statusCode: 401,
          message: 'Cannot delete user, invalid credentials!',
        };
        throw usernameAuthError;
      }

      await Todo.deleteMany({
        username: usernameFromAuth,
      });

      await User.deleteOne({
        username: usernameFromAuth,
      });

      res.clearCookie('rft', { path: '/' });
      res.clearCookie('act', { path: '/' });
      res.clearCookie('_csrf', { path: '/' });
      res.clearCookie('XSRF-TOKEN', { path: '/' });

      return res.status(200).json({
        message: 'Successfully deleted account!',
      });
    } catch (err) {
      return next(err);
    }
  }
}

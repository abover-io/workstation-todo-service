import { compareSync, hashSync } from 'bcryptjs';
import createError, { HttpError } from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client, LoginTicket, TokenPayload } from 'google-auth-library';

// Typings
import {
  ISocial,
  ISignUpValidations,
  CustomHttpError,
  ISignInValidations,
  IUpdateUserValidations,
} from '@/typings';
import { IUserDocument } from '@/typings/user';
import { ITodoDocument } from '@/typings/todo';

// Config
import {
  JWT_REFRESH_SECRET,
  GOOGLE_OAUTH_WEB_CLIENT_ID,
  GOOGLE_OAUTH_WEB_CLIENT_SECRET,
} from '@/config';

// Models
import { User, Social, Todo } from '@/models';

// Utils
import {
  generateUserTokens,
  handleRefreshToken,
  decideCookieOptions,
  CustomValidator,
  createToken,
} from '@/utils';

const googleClient: OAuth2Client = new OAuth2Client({
  clientId: GOOGLE_OAUTH_WEB_CLIENT_ID,
  clientSecret: GOOGLE_OAUTH_WEB_CLIENT_SECRET,
});

export default class UserController {
  public static async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const refreshToken =
        req.signedCookies.rft || req.cookies.rft || req.body.rft;

      const newTokens = await handleRefreshToken(refreshToken);

      res.cookie('act', newTokens.accessToken, {
        httpOnly: true,
        secure: decideCookieOptions('secure'),
        path: '/',
        signed: true,
        sameSite: decideCookieOptions('sameSite'),
      });

      res.cookie('rft', newTokens.refreshToken, {
        httpOnly: true,
        secure: decideCookieOptions('secure'),
        path: '/',
        signed: true,
        sameSite: decideCookieOptions('sameSite'),
      });

      res.cookie('XSRF-TOKEN', req.csrfToken(), {
        secure: decideCookieOptions('secure'),
        sameSite: decideCookieOptions('sameSite'),
      });

      return res.status(200).json({
        tokens: {
          ...newTokens,
          csrfToken: req.csrfToken(),
        },
        message: 'Successfully refreshed token!',
      });
    } catch (err) {
      if (err.name == 'RefreshTokenError') {
        return next(
          createError({
            name: 'AuthorizationError',
            message: err.message,
          }),
        );
      } else {
        return next(err);
      }
    }
  }

  public static async signUp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
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

      const existedUser: IUserDocument | any = await User.findOne({
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
          {
            firstName,
            lastName,
            username,
            email,
          },
          'signUp',
        );
        const newApiKey = createToken('apiKey', { username, email });

        await User.create({
          firstName,
          lastName,
          isUsernameSet: true,
          username,
          email,
          isPasswordSet: true,
          password,
          verified: false,
          refreshTokens: [newUserTokens.refreshToken],
          apiKey: newApiKey,
        });

        res.cookie('act', newUserTokens.accessToken, {
          httpOnly: true,
          secure: decideCookieOptions('secure'),
          path: '/',
          signed: true,
          sameSite: decideCookieOptions('sameSite'),
        });

        res.cookie('rft', newUserTokens.refreshToken, {
          httpOnly: true,
          secure: decideCookieOptions('secure'),
          path: '/',
          signed: true,
          sameSite: decideCookieOptions('sameSite'),
        });

        res.cookie('XSRF-TOKEN', req.csrfToken(), {
          secure: decideCookieOptions('secure'),
          sameSite: decideCookieOptions('sameSite'),
        });

        return res.status(201).json({
          user: {
            firstName,
            lastName,
            isUsernameSet: true,
            username,
            email,
            isPasswordSet: true,
            verified: false,
            apiKey: newApiKey,
          },
          tokens: {
            ...newUserTokens,
            csrfToken: req.csrfToken(),
          },
          message: 'Successfully signed up!',
        });
      }
    } catch (err) {
      return next(err);
    }
  }

  public static async signIn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
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
            secure: decideCookieOptions('secure'),
            path: '/',
            signed: true,
            sameSite: decideCookieOptions('sameSite'),
          });
          res.cookie('rft', tokens.refreshToken, {
            httpOnly: true,
            secure: decideCookieOptions('secure'),
            path: '/',
            signed: true,
            sameSite: decideCookieOptions('sameSite'),
          });

          res.cookie('XSRF-TOKEN', req.csrfToken(), {
            secure: decideCookieOptions('secure'),
            sameSite: decideCookieOptions('sameSite'),
          });

          return res.status(200).json({
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
              csrfToken: req.csrfToken(),
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
      return next(err);
    }
  }

  public static async googleSignIn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const googleIdToken: string = req.body.googleIdToken;

      const verifyIdTokenResponse: LoginTicket = await googleClient.verifyIdToken(
        {
          idToken: googleIdToken,
          audience: GOOGLE_OAUTH_WEB_CLIENT_ID,
        },
      );

      const googleAccountPayload:
        | TokenPayload
        | any = verifyIdTokenResponse.getPayload();

      let {
        given_name: firstName,
        family_name: lastName,
        sub: username,
        email,
        picture: profileImageURL,
      } = googleAccountPayload as TokenPayload;

      firstName = firstName as string;
      lastName = lastName as string;
      username = username as string;
      email = email as string;

      const googleId: string = (googleAccountPayload as TokenPayload)
        .sub as string;

      const existingUser: IUserDocument | any = await User.findOne({
        email: (googleAccountPayload as TokenPayload).email,
      });

      const existingSocial: ISocial | any = await Social.findOne({
        name: 'google',
        socialId: googleId,
      });

      if (!existingUser) {
        const newUserTokens = await generateUserTokens(
          {
            firstName,
            lastName,
            username,
            email,
          },
          'signUp',
        );

        const newApiKey = createToken('apiKey', {
          username,
          email,
        });

        const newUser: IUserDocument | any = await User.create({
          firstName,
          lastName,
          isUsernameSet: true,
          username,
          email,
          isPasswordSet: false,
          verified: false,
          profileImageURL,
          refreshTokens: [newUserTokens.refreshToken],
          apiKey: newApiKey,
        });

        await Social.create({
          name: 'google',
          socialId: googleId,
          userId: (newUser as IUserDocument)._id,
        });

        res.cookie('act', newUserTokens.accessToken, {
          httpOnly: true,
          secure: decideCookieOptions('secure'),
          path: '/',
          signed: true,
          sameSite: decideCookieOptions('sameSite'),
        });

        res.cookie('rft', newUserTokens.refreshToken, {
          httpOnly: true,
          secure: decideCookieOptions('secure'),
          path: '/',
          signed: true,
          sameSite: decideCookieOptions('sameSite'),
        });

        res.cookie('XSRF-TOKEN', req.csrfToken(), {
          secure: decideCookieOptions('secure'),
          sameSite: decideCookieOptions('sameSite'),
        });

        return res.status(201).json({
          user: {
            firstName,
            lastName,
            isUsernameSet: true,
            username,
            email,
            isPasswordSet: false,
            verified: false,
            apiKey: newApiKey,
            profileImageURL,
          },
          tokens: {
            ...newUserTokens,
            csrfToken: req.csrfToken(),
          },
          message: 'Successfully signed up!',
        });
      } else {
        if (!existingSocial) {
          await Social.create({
            name: 'google',
            socialId: googleId,
            userId: (existingUser as IUserDocument)._id,
          });
        }

        const tokens = await generateUserTokens({
          firstName,
          lastName,
          username,
          email,
        });

        res.cookie('act', tokens.accessToken, {
          httpOnly: true,
          secure: decideCookieOptions('secure'),
          path: '/',
          signed: true,
          sameSite: decideCookieOptions('sameSite'),
        });

        res.cookie('rft', tokens.refreshToken, {
          httpOnly: true,
          secure: decideCookieOptions('secure'),
          path: '/',
          signed: true,
          sameSite: decideCookieOptions('sameSite'),
        });

        res.cookie('XSRF-TOKEN', req.csrfToken(), {
          secure: decideCookieOptions('secure'),
          sameSite: decideCookieOptions('sameSite'),
        });

        return res.status(200).json({
          user: {
            firstName,
            lastName,
            isUsernameSet: existingUser.isUsernameSet,
            username,
            email,
            isPasswordSet: existingUser.isPasswordSet,
            verified: existingUser.verified,
            apiKey: existingUser.apiKey,
            profileImageURL,
          },
          message: 'Successfully signed in!',
          tokens: {
            ...tokens,
            csrfToken: req.csrfToken(),
          },
        });
      }
    } catch (err) {
      return next(err);
    }
  }

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

  public static async signOut(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    const receivedRefreshToken: string =
      req.signedCookies.rft ||
      req.cookies.rft ||
      req.headers['X-RFT'] ||
      req.headers['x-rft'] ||
      req.body.rft;

    try {
      if (!receivedRefreshToken) {
        res.clearCookie('rft', { path: '/' });
        res.clearCookie('act', { path: '/' });
        res.clearCookie('_csrf', { path: '/' });
        res.clearCookie('XSRF-TOKEN', { path: '/' });
        res.status(200).json({ message: 'Successfully signed out!' });
      } else {
        const { username }: IUserDocument | any = jwt.verify(
          receivedRefreshToken,
          JWT_REFRESH_SECRET,
        );

        const foundUser: IUserDocument | any = await User.findOne({
          username,
        });

        const updatedRefreshTokens: string[] = foundUser.refreshTokens.filter(
          (refreshToken: string) => refreshToken != receivedRefreshToken,
        );

        await User.updateOne(
          { username },
          { refreshTokens: updatedRefreshTokens },
        );

        res.clearCookie('act', { path: '/' });
        res.clearCookie('rft', { path: '/' });
        res.clearCookie('_csrf', { path: '/' });
        res.clearCookie('XSRF-TOKEN', { path: '/' });
        return res.status(200).json({ message: 'Successfully signed out!' });
      }
    } catch (err) {
      return next(err);
    }
  }

  public static async sync(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const { username }: IUserDocument = (<any>req).user;
      const {
        firstName,
        lastName,
        isUsernameSet,
        email,
        isPasswordSet,
        verified,
        apiKey,
      }: IUserDocument | any = await User.findOne({
        username,
      });
      const todos: ITodoDocument[] = await Todo.find({
        username,
        completed: false,
      });

      return res.status(200).json({
        user: {
          firstName,
          lastName,
          isUsernameSet,
          username,
          email,
          isPasswordSet,
          verified,
          apiKey,
        },
        todos,
        message: 'Successfully synced!',
      });
    } catch (err) {
      return next(err);
    }
  }
}

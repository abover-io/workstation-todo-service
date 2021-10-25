import { compareSync } from 'bcryptjs';
import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { OAuth2Client, LoginTicket, TokenPayload } from 'google-auth-library';
import jwt from 'jsonwebtoken';

// Types
import { ICustomRequest } from '@/types';
import {
  ISignUpFormValidations,
  ISignUpFormData,
  ISignInFormValidations,
  ISignInFormData,
} from '@/types/auth';
import { IUser, IUserDocument } from '@/types/user';
import { ISocialDocument } from '@/types/social';

// Config
import {
  JWT_REFRESH_SECRET,
  JWT_ACCESS_SECRET,
  GOOGLE_OAUTH_WEB_CLIENT_ID,
  GOOGLE_OAUTH_WEB_CLIENT_SECRET,
} from '@/config';

// Models
import { User, Social, List } from '@/models';

// Utils
import { redisClient } from '@/utils';
import { UserValidator } from '@/utils/validator';
import { handleToken } from '@/utils/user';

const googleClient: OAuth2Client = new OAuth2Client({
  clientId: GOOGLE_OAUTH_WEB_CLIENT_ID,
  clientSecret: GOOGLE_OAUTH_WEB_CLIENT_SECRET,
});

export default class AuthController {
  public static async RefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const rft =
        req.signedCookies.rft ||
        req.cookies.rft ||
        req.headers['X-RFT'] ||
        req.headers['x-RFT'] ||
        req.body.rft;

      if (!rft) {
        throw createError(401, 'Please sign in to continue!');
      }

      const decodedRft: any = jwt.verify(rft, JWT_REFRESH_SECRET);

      const foundUser: IUserDocument | null = await User.findOne({
        email: decodedRft.email,
      });

      if (!foundUser) {
        throw createError(401, 'Please sign in to continue!');
      }

      const user: Partial<IUser> = {
        ...foundUser.toObject(),
      };
      delete user.password;

      const tokens = await handleToken(user, req, res);

      return res.status(200).json({
        user,
        ...tokens,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async SignUp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const formData: ISignUpFormData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };

      const validations: ISignUpFormValidations = {
        name: UserValidator.Name(formData.name),
        email: UserValidator.Email(formData.email),
        password: UserValidator.Password(formData.password),
      };

      if (Object.values(validations).some((v) => v.error === true)) {
        throw createError(400, {
          message: 'Please correct sign up validations!',
          validations,
        });
      }

      const existingUser: IUserDocument | null = await User.findOne({
        email: formData.email,
      });

      if (existingUser) {
        throw createError(
          400,
          `User with email ${existingUser.email} already exists!`,
        );
      }

      const createdUser: IUserDocument = await User.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const user: Partial<IUser> = {
        ...createdUser.toObject(),
      };
      delete user.password;

      await List.create({
        userId: createdUser._id,
        name: 'Reminders',
        color: '#2979ff',
      });

      const tokens = await handleToken(user, req, res);

      return res.status(201).json({
        message: 'Successfully signed up!',
        user,
        ...tokens,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async SignIn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const formData: ISignInFormData = {
        email: req.body.email,
        password: req.body.password,
      };

      const validations: ISignInFormValidations = {
        email: UserValidator.Email(formData.email),
        password: UserValidator.Password(formData.password),
      };

      if (Object.values(validations).some((v) => v.error === true)) {
        throw createError(400, {
          message: 'Please correct sign in validations!',
          validations,
        });
      }

      const foundUser: IUserDocument | null = await User.findOne({
        email: formData.email,
      });

      if (!foundUser) {
        throw createError(404, `User not found, please sign up!`);
      }

      if (compareSync(formData.password, foundUser.password!)) {
        const actCacheKey: string = JSON.stringify({
          type: 'act',
          userId: foundUser._id,
        });
        const rftCacheKey: string = JSON.stringify({
          type: 'rft',
          userId: foundUser._id,
        });

        let [foundAct, foundRft] = await Promise.all([
          redisClient.getAsync(actCacheKey),
          redisClient.getAsync(rftCacheKey),
        ]);

        const user: Partial<IUser> = {
          ...foundUser.toObject(),
        };
        delete user.password;

        if (!foundAct) {
          const newAct: string = jwt.sign(user, JWT_ACCESS_SECRET, {
            expiresIn: '7d',
          });

          await redisClient.setexAsync(actCacheKey, 60 * 60 * 24 * 7, newAct);

          foundAct = newAct;
        }

        if (!foundRft) {
          const newRft: string = jwt.sign(user, JWT_REFRESH_SECRET, {
            expiresIn: '30d',
          });

          redisClient.setexAsync(rftCacheKey, 60 * 60 * 24 * 30, newRft);

          foundRft = newRft;
        }

        res.cookie('act', foundAct, {
          httpOnly: true,
          secure: req.secure,
          path: '/',
          signed: true,
          sameSite: req.secure ? 'none' : false,
        });

        res.cookie('rft', foundAct, {
          httpOnly: true,
          secure: req.secure,
          path: '/',
          signed: true,
          sameSite: req.secure ? 'none' : false,
        });

        res.cookie('_xsrf', req.csrfToken(), {
          secure: req.secure,
          path: '/',
          signed: true,
          sameSite: req.secure ? 'none' : false,
        });

        return res.status(200).json({
          message: 'Successfully signed in!',
          user,
          act: foundAct,
          rft: foundRft,
        });
      } else {
        throw createError({
          name: 'BadRequestError',
          message: 'Wrong username or password!',
          expose: false,
        });
      }
    } catch (err) {
      return next(err);
    }
  }

  public static async GoogleSignIn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      let isNew: boolean = false;
      const googleIdToken: string = req.body.googleIdToken;

      const verifyIdTokenResponse: LoginTicket =
        await googleClient.verifyIdToken({
          idToken: googleIdToken,
          audience: GOOGLE_OAUTH_WEB_CLIENT_ID,
        });

      const googleAccountPayload: TokenPayload | undefined =
        verifyIdTokenResponse.getPayload();

      let {
        name,
        email,
        picture: photo,
      } = googleAccountPayload as TokenPayload;

      name = name as string;
      email = email as string;
      photo = photo as string;

      const googleId: string = (googleAccountPayload as TokenPayload)
        .sub as string;

      let foundUser: IUserDocument | null = await User.findOne({
        email,
      });

      let foundSocial: ISocialDocument | null = await Social.findOne({
        name: 'google',
        socialId: googleId,
      });

      if (!foundUser) {
        isNew = true;

        const createdUser: IUserDocument = await User.create({
          name,
          email,
          password: null,
          photo,
        });

        foundUser = createdUser;

        await Promise.all([
          Social.create({
            name: 'google',
            socialId: googleId,
            userId: createdUser._id,
          }),
          List.create({
            userId: createdUser._id,
            name: 'Reminders',
            color: '#2979ff',
          }),
        ]);
      } else if (!foundSocial) {
        const createdSocial: ISocialDocument = await Social.create({
          name: 'google',
          socialId: googleId,
          userId: foundUser!._id,
        });

        foundSocial = createdSocial;
      }

      const user: Partial<IUser> = {
        ...foundUser.toObject(),
      };
      delete user.password;

      const tokens = await handleToken(user, req, res);

      return res.status(201).json({
        message: isNew ? 'Successfully signed up!' : 'Successfully signed in!',
        user,
        ...tokens,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async SignOut(
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
        res.clearCookie('_xsrf', { path: '/' });
        res.status(200).json({ message: 'Successfully signed out!' });
      } else {
        const { email }: IUser = jwt.verify(
          receivedRefreshToken,
          JWT_REFRESH_SECRET,
        ) as IUser;

        const foundUser: IUserDocument | null = await User.findOne({
          email,
        });

        if (foundUser) {
          await redisClient.delAsync(
            JSON.stringify({
              type: 'act',
              userId: foundUser._id,
            }),
            JSON.stringify({
              type: 'rft',
              userId: foundUser._id,
            }),
          );
        }

        res.clearCookie('act', { path: '/' });
        res.clearCookie('rft', { path: '/' });
        res.clearCookie('_xsrf', { path: '/' });
        return res.status(200).json({ message: 'Successfully signed out!' });
      }
    } catch (err) {
      return next(err);
    }
  }

  public static async Sync(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const { email } = (<ICustomRequest>req).user;

      const foundUser: IUserDocument | null = await User.findOne(
        {
          email,
        },
        {
          __v: 0,
          password: 0,
        },
      );

      return res.status(200).json({
        message: 'Successfully synced!',
        user: foundUser,
      });
    } catch (err) {
      return next(err);
    }
  }
}

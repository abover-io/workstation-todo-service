import { compareSync } from 'bcryptjs';
import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { OAuth2Client, LoginTicket, TokenPayload } from 'google-auth-library';
import jwt from 'jsonwebtoken';

// Types
import { ICustomRequest } from '@/types';
import { ISignUpValidations, ISignInValidations } from '@/types/auth';
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
import { User, Social, Todo } from '@/models';

// Utils
import { redisClient } from '@/utils';
import { UserValidator } from '@/utils/validator';

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

      const newAct: string = jwt.sign(
        {
          email: foundUser.email,
        },
        JWT_ACCESS_SECRET,
        {
          expiresIn: '7d',
        },
      );

      const newRft: string = jwt.sign(
        {
          email: foundUser.email,
        },
        JWT_REFRESH_SECRET,
        {
          expiresIn: '30d',
        },
      );

      await Promise.all([
        redisClient.setexAsync(
          JSON.stringify({
            type: 'act',
            userId: foundUser._id,
          }),
          60 * 60 * 24 * 7,
          newAct,
        ),
        redisClient.setexAsync(
          JSON.stringify({
            type: 'rft',
            userId: foundUser._id,
          }),
          60 * 60 * 24 * 30,
          newRft,
        ),
      ]);

      res.cookie('act', newAct, {
        httpOnly: true,
        secure: req.secure,
        path: '/',
        signed: true,
        sameSite: req.secure ? 'none' : false,
      });

      res.cookie('rft', newRft, {
        httpOnly: true,
        secure: req.secure,
        path: '/',
        signed: true,
        sameSite: req.secure ? 'none' : false,
      });

      res.cookie('XSRF-TOKEN', req.csrfToken(), {
        secure: req.secure,
        sameSite: req.secure ? 'none' : false,
      });

      return res.status(200).json({
        csrf: req.csrfToken(),
        act: newAct,
        rft: newRft,
      });
    } catch (err) {
      return err;
    }
  }

  public static async SignUp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any>> {
    try {
      const { name, email, password } = req.body;

      const validations: ISignUpValidations = {
        name: UserValidator.Name(name),
        email: UserValidator.Email(email),
        password: UserValidator.Password(password),
      };

      if (Object.values(validations).some((v) => v.error === true)) {
        throw createError(400, {
          message: 'Please correct sign in information!',
          validations,
        });
      }

      const existingUser: IUserDocument | any = await User.findOne({
        email,
      });

      if (existingUser) {
        throw createError(400, 'Email is not available');
      }

      const createdUser: IUserDocument = await User.create({
        name,
        email,
        password,
        verified: false,
      });

      const newAct: string = jwt.sign(
        {
          email: createdUser.email,
        },
        JWT_ACCESS_SECRET,
        {
          expiresIn: '7d',
        },
      );

      const newRft: string = jwt.sign(
        {
          email: createdUser.email,
        },
        JWT_REFRESH_SECRET,
        {
          expiresIn: '30d',
        },
      );

      await Promise.all([
        redisClient.setexAsync(
          JSON.stringify({
            type: 'act',
            userId: createdUser._id,
          }),
          60 * 60 * 24 * 7,
          newAct,
        ),
        redisClient.setexAsync(
          JSON.stringify({
            type: 'rft',
            userId: createdUser._id,
          }),
          60 * 60 * 24 * 30,
          newRft,
        ),
      ]);

      res.cookie('act', newAct, {
        httpOnly: true,
        secure: req.secure,
        path: '/',
        signed: true,
        sameSite: req.secure ? 'none' : false,
      });

      res.cookie('rft', newRft, {
        httpOnly: true,
        secure: req.secure,
        path: '/',
        signed: true,
        sameSite: req.secure ? 'none' : false,
      });

      res.cookie('XSRF-TOKEN', req.csrfToken(), {
        secure: req.secure,
        sameSite: req.secure ? 'none' : false,
      });

      return res.status(201).json({
        message: 'Successfully signed up!',
        user: {
          name,
          email,
          verified: false,
        },
        act: newAct,
        rft: newRft,
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
      const { email, password } = req.body;

      const validations: ISignInValidations = {
        email: UserValidator.Email(email),
        password: UserValidator.Password(password),
      };

      if (Object.values(validations).some((v) => v.error === true)) {
        throw createError(400, {
          message: 'Please correct sign in information!',
          validations,
        });
      }

      const foundUser: IUserDocument | null = await User.findOne({
        email,
      });

      if (!foundUser) {
        throw createError(404, `User not found, please sign up!`);
      }

      if (compareSync(password, foundUser.password!)) {
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

        if (!foundAct) {
          const newAct: string = jwt.sign(
            {
              email: foundUser.email,
            },
            JWT_ACCESS_SECRET,
            {
              expiresIn: '7d',
            },
          );

          await redisClient.setexAsync(actCacheKey, 60 * 60 * 24 * 7, newAct);

          foundAct = newAct;
        }

        if (!foundRft) {
          const newRft: string = jwt.sign(
            {
              email: foundUser.email,
            },
            JWT_REFRESH_SECRET,
            {
              expiresIn: '30d',
            },
          );

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

        res.cookie('XSRF-TOKEN', req.csrfToken(), {
          secure: req.secure,
          sameSite: req.secure ? 'none' : false,
        });

        res.cookie('_aed', true, {
          secure: req.secure,
          sameSite: req.secure ? 'none' : false,
        });

        return res.status(200).json({
          message: 'Successfully signed in!',
          user: {
            name: foundUser.name,
            email: foundUser.email,
            verified: foundUser.verified,
          },
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
      const googleIdToken: string = req.body.googleIdToken;

      const verifyIdTokenResponse: LoginTicket = await googleClient.verifyIdToken(
        {
          idToken: googleIdToken,
          audience: GOOGLE_OAUTH_WEB_CLIENT_ID,
        },
      );

      const googleAccountPayload:
        | TokenPayload
        | undefined = verifyIdTokenResponse.getPayload();

      let {
        name,
        email,
        picture: profileImageURL,
      } = googleAccountPayload as TokenPayload;

      name = name as string;
      email = email as string;
      profileImageURL = profileImageURL as string;

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
        const createdUser: IUserDocument = await User.create({
          name,
          email,
          password: null,
          verified: false,
          profileImageURL,
        });

        foundUser = createdUser;

        await Social.create({
          name: 'google',
          socialId: googleId,
          userId: createdUser._id,
        });
      } else {
        if (!foundSocial) {
          const createdSocial: ISocialDocument = await Social.create({
            name: 'google',
            socialId: googleId,
            userId: foundUser!._id,
          });

          foundSocial = createdSocial;
        }
      }

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

      if (!foundAct) {
        const newAct: string = jwt.sign(
          {
            email: foundUser.email,
          },
          JWT_ACCESS_SECRET,
          {
            expiresIn: '7d',
          },
        );

        await redisClient.setexAsync(actCacheKey, 60 * 60 * 24 * 7, newAct);

        foundAct = newAct;
      }

      if (!foundRft) {
        const newRft: string = jwt.sign(
          {
            email: foundUser.email,
          },
          JWT_REFRESH_SECRET,
          {
            expiresIn: '30d',
          },
        );

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

      res.cookie('rft', foundRft, {
        httpOnly: true,
        secure: req.secure,
        path: '/',
        signed: true,
        sameSite: req.secure ? 'none' : false,
      });

      res.cookie('XSRF-TOKEN', req.csrfToken(), {
        secure: req.secure,
        sameSite: req.secure ? 'none' : false,
      });

      return res.status(201).json({
        message: 'Successfully signed up!',
        user: {
          name,
          email,
          verified: false,
          profileImageURL,
        },
        act: foundAct,
        rft: foundRft,
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
        res.clearCookie('_csrf', { path: '/' });
        res.clearCookie('XSRF-TOKEN', { path: '/' });
        res.clearCookie('_aed', { path: '/' });
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
        res.clearCookie('_csrf', { path: '/' });
        res.clearCookie('XSRF-TOKEN', { path: '/' });
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
          createdAt: 0,
          updatedAt: 0,
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

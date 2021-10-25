import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Types
import { IUser } from '@/types/user';

// Config
import { JWT_REFRESH_SECRET, JWT_ACCESS_SECRET } from '@/config';

// Utils
import { redisClient } from '@/utils';

interface HandleTokenData {
  csrf: string;
  act: string;
  rft: string;
}

export default async function handleToken(
  user: Partial<IUser>,
  req: Request,
  res: Response,
): Promise<HandleTokenData> {
  const actCacheKey: string = JSON.stringify({
    type: 'act',
    userId: user._id,
  });
  const rftCacheKey: string = JSON.stringify({
    type: 'rft',
    userId: user._id,
  });

  let [foundAct, foundRft] = await Promise.all([
    redisClient.getAsync(actCacheKey),
    redisClient.getAsync(rftCacheKey),
  ]);

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

    await redisClient.setexAsync(rftCacheKey, 60 * 60 * 24 * 30, newRft);

    foundRft = newRft;
  }

  await Promise.all([
    redisClient.setexAsync(
      JSON.stringify({
        type: 'act',
        userId: user._id,
      }),
      60 * 60 * 24 * 7,
      foundAct,
    ),
    redisClient.setexAsync(
      JSON.stringify({
        type: 'rft',
        userId: user._id,
      }),
      60 * 60 * 24 * 30,
      foundRft,
    ),
  ]);

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

  res.cookie('_xsrf', req.csrfToken(), {
    secure: req.secure,
    path: '/',
    signed: true,
    sameSite: req.secure ? 'none' : false,
  });

  return Promise.resolve({
    csrf: req.csrfToken(),
    act: foundAct,
    rft: foundRft,
  });
}

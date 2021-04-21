import { sign as signJWT } from 'jsonwebtoken';

import { IUser, IUserTokens } from '@/types';
import { User } from '@/models';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '@/config';

export default async function generateUserTokens(
  userData: IUser | any,
  mode: 'signIn' | 'signUp' = 'signIn',
): Promise<IUserTokens> {
  const err = new Error();
  err.name = 'GenerateUserTokensError';

  try {
    const { firstName, lastName, username, email }: IUser = userData;
    const accessToken: string = signJWT(
      { firstName, lastName, username, email },
      JWT_ACCESS_SECRET,
      { expiresIn: '7d' },
    );
    const refreshToken: string = signJWT({ username }, JWT_REFRESH_SECRET, {
      expiresIn: '365d',
    });

    switch (mode) {
      case 'signIn':
        const foundUser: IUser | any = await User.findOne({
          username: userData.username,
        });

        const newRefreshTokens: string[] = foundUser.refreshTokens.concat(
          refreshToken,
        );

        await User.updateOne(
          { username: userData.username },
          { refreshTokens: newRefreshTokens },
        );

        return Promise.resolve({
          accessToken,
          refreshToken,
        });

      case 'signUp':
        return Promise.resolve({
          accessToken,
          refreshToken,
        });
    }
  } catch (err) {
    return Promise.reject(err);
  }
}

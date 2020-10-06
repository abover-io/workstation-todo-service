import { verify as verifyJWT, sign as signJWT } from 'jsonwebtoken';

import { IHandleRefreshTokenOutput } from '@/typings';
import { User } from '@/models';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '@/config';

export default async function (
  refreshToken: string | any
): Promise<IHandleRefreshTokenOutput> {
  const defaultError = new Error();
  defaultError.name = 'RefreshTokenError';
  defaultError.message = `Invalid refresh token! You aren't signed in!`;

  try {
    const decodedRefreshToken: any = verifyJWT(
      refreshToken,
      JWT_REFRESH_SECRET
    );
    const foundUser = await User.findOne({
      username: decodedRefreshToken.username,
    });

    if (!foundUser) {
      defaultError.message = 'Invalid refresh token. No user found!';
      throw defaultError;
    } else {
      const userRefreshTokens = foundUser.refreshTokens;
      if (userRefreshTokens.includes(refreshToken)) {
        const { firstName, lastName, email, username } = foundUser;
        const newAccessToken = await signJWT(
          { firstName, lastName, email, username },
          JWT_ACCESS_SECRET,
          { expiresIn: '7d' }
        );
        const newRefreshToken = await signJWT(
          { username },
          JWT_REFRESH_SECRET,
          { expiresIn: '365d' }
        );
        const newUserRefreshTokens = userRefreshTokens.filter(
          (refreshTokenEl) => {
            return refreshTokenEl != refreshToken;
          }
        );
        newUserRefreshTokens.push(newRefreshToken);
        await User.updateOne(
          { username },
          { refreshTokens: newUserRefreshTokens }
        );
        return Promise.resolve({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      } else {
        throw defaultError;
      }
    }
  } catch (err) {
    return Promise.reject(defaultError);
  }
}

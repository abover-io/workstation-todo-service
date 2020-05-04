import { sign as signJWT } from 'jsonwebtoken';

import { IUserModel } from "../models/user";

export default async function generateUserTokens(userData: IUserModel | any): Promise<any> {
  const JWT_ACCESS_SECRET: string | any = process.env.JWT_ACCESS_SECRET;
  const JWT_REFRESH_SECRET: string | any = process.env.JWT_REFRESH_SECRET;
  const err = new Error();
  err.name = "GenerateUserTokensError";

  try {
    const { firstName, lastName, username, email }: IUserModel = userData;
    const accessToken: string = await signJWT({ firstName, lastName, username, email }, JWT_ACCESS_SECRET, { expiresIn: "7d" });
    const refreshToken: string = await signJWT({ username }, JWT_REFRESH_SECRET, { expiresIn: "365d" });
    return Promise.resolve({
      accessToken,
      refreshToken
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

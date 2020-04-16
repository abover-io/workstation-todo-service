import { verify } from 'jsonwebtoken';

export default (token: string): boolean => {
  try {
    const JWT_SECRET_KEY: any = process.env.JWT_SECRET_KEY;
    verify(token, JWT_SECRET_KEY);
    return true;
  } catch (err) {
    return false;
  }
};

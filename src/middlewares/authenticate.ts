import { verify } from 'jsonwebtoken';

export default (req: any, res: any, next: any) => {
  try {
    const { token } = req.headers;
    const JWT_SECRET_KEY: any = process.env.JWT_SECRET_KEY;
    const user = verify(token, JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

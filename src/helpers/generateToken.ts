import { sign } from 'jsonwebtoken';

export default function generateToken(inputData: object) {
  const JWT_SECRET_KEY: any = process.env.JWT_SECRET_KEY;
  return sign(inputData, JWT_SECRET_KEY);
}

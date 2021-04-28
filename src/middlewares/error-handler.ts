import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';

import { CustomHttpError } from '@/types';

export default function (
  err: HttpError | CustomHttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err.status != 500) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: err.message,
  });
}

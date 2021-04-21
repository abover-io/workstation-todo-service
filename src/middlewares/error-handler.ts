import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';

import { CustomHttpError } from '@/types';

export default function (
  err: HttpError | CustomHttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errObj = {
    name: err.name,
    status: err.status,
    message: err.message,
  };

  switch (err.name) {
    case 'AuthorizationError':
      return res.status(401).json(errObj);

    case 'BadRequestError':
      return res.status(400).json(errObj);

    case 'JsonWebTokenError':
      return res.status(400).json(errObj);

    case 'NotFoundError':
      return res.status(404).json(errObj);

    case 'AlreadyExistsError':
      return res.status(400).json(errObj);

    case 'ValidationError':
      return res.status(400).json(errObj);

    case 'RefreshTokenError':
      return res.status(401).json(errObj);

    default:
      return res.status(500).json(errObj);
  }
}

import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';

export default function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  switch (err.status) {
    case 400:
      if (err.validations) {
        return res.status(400).json({
          message: err.message,
          validations: err.validations,
        });
      }
      return res.status(400).json({
        message: err.message,
      });

    case 401:
      return res.status(401).json({
        message: err.message,
      });

    case 403:
      return res.status(403).json({
        message: err.message,
      });

    case 404:
      return res.status(404).json({
        message: err.message,
      });

    default:
      return res.status(500).json({
        message: err.message,
      });
  }
}

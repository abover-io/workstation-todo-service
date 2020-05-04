import { Request, Response, NextFunction } from "express";

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  switch (err.name) {
    case "AuthorizationError":
      return res.status(401).json({ message: err.message });

    case "UserNotFound":
      return res.status(404).json({ message: err.message });

    case "BadRequestError":
      return res.status(400).json({ message: err.message });

    case "JsonWebTokenError":
      return res.status(400).json({ message: "Invalid token!" });

    case "NotFoundError":
      return res.status(404).json({ message: err.message });

    default:
      return res.status(500).json({ message: err.message });
  }
};

interface IError extends Error {
  status: number;
  name: string;
  message: string;
}

export default (err: IError, req: object, res: any, next: any) => {
  switch (err.name) {
    case "AuthorizationError":
      res.status(401).json({ message: err.message });
      break;

    case "UserNotFound":
      res.status(404).json({ message: err.message });
      break;

    case "WrongUsernameOrPassword":
      res.status(400).json({ message: err.message });
      break;

    case "JsonWebTokenError":
      res.status(400).json({ message: "Invalid token!" });
      break;

    default:
      res.status(500).json({ message: err.message });
      break;
  }
};

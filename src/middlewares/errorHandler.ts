interface IError extends Error {
  status: number;
  name: string;
  message: string
}

export default (err: IError, req: object, res: any, next: any) => {
  switch (err.name) {
    case 'AuthorizationError':
      res.status(401).json({message: err.message});
      break;
  
    default:
      console.log(err.name);
      res.status(500).json({message: err.message});
      break;
  }
};

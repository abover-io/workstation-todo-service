export const decideMongoURI = () => {
  const defaultMongoURI = 'mongodb://localhost:27017/fancy-todo-api';
  switch (process.env.NODE_ENV) {
    case 'development':
      return `${defaultMongoURI}-dev`;
  
    case 'test':
      return `${defaultMongoURI}-test`;

    default:
      return defaultMongoURI;
  }
};

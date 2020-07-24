export default function decideMongoURI(
  env?: 'development' | 'test' | 'production' | string,
) {
  const nodeEnv = env || process.env.NODE_ENV;
  const mongoContainer = process.env.MONGO_CONTAINER;
  const defaultMongoURI = `mongodb://${
    mongoContainer || 'localhost'
  }:27017/fancy-todo-api`;
  switch (nodeEnv) {
    case 'development':
      return `${defaultMongoURI}-dev`;

    case 'test':
      return `${defaultMongoURI}-test`;

    default:
      return defaultMongoURI;
  }
}
